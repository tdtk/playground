import {
  editor,
  languages,
  Range,
  CancellationToken,
  Position,
  MarkerSeverity,
} from 'monaco-editor';
import { callKoinu } from './koinu';
import { ErrorLog, PuppyVM } from '@playpuppy/puppy2d';
import { messagefy } from '@playpuppy/puppy2d/dist/lang/message';
import { add_log } from './firebase/firestore';

export type CodeEditor = editor.IStandaloneCodeEditor;
export type ContentChangedEvent = editor.IModelContentChangedEvent;

editor.defineTheme('error', {
  base: 'vs',
  inherit: true,
  rules: [],
  colors: {
    'editor.background': '#ffEEEE',
  },
});

languages.registerCodeActionProvider('python', {
  provideCodeActions: (
    model: editor.ITextModel,
    range: Range,
    context: languages.CodeActionContext,
    _token: CancellationToken
  ) => {
    const codeActions: Promise<languages.CodeAction>[] = [];
    for (const mk of context.markers) {
      switch (mk.code) {
        case 'NLKeyValues': {
          const NLPSymbol = mk.source;
          if (NLPSymbol) {
            codeActions.push(
              callKoinu(NLPSymbol).then(json => {
                console.log(json);
                const key = Object.keys(json)[0];
                let text = '';
                if (key == 'shape') {
                  text = json[key];
                } else if (key == 'color') {
                  text = `fillStyle="${json[key]}"`;
                } else {
                  text = `${key}=${
                    typeof json[key] == 'string' ? `"${json[key]}"` : json[key]
                  }`;
                }
                return {
                  title: `もしかして「${text}」ですか？`,
                  edit: {
                    edits: [
                      {
                        edits: [
                          {
                            range,
                            text,
                          },
                        ],
                        resource: model.uri,
                      },
                    ],
                  },
                  kind: 'quickfix',
                  isPreferred: true,
                };
              })
            );
          }
          break;
        }
        default:
          break;
      }
    }
    return Promise.all(codeActions);
  },
});

languages.registerCompletionItemProvider('python', {
  provideCompletionItems: (
    model: editor.ITextModel,
    position: Position,
    _context: languages.CompletionContext,
    _token
  ) => {
    const wordInfo = model.getWordUntilPosition(position);
    const range = new Range(
      position.lineNumber,
      wordInfo.startColumn,
      position.lineNumber,
      wordInfo.endColumn
    );
    const math = [
      'pi',
      'sin',
      'cos',
      'tan',
      'sqrt',
      'log',
      'log10',
      'pow',
      'hypot',
      'gcd',
    ];
    const python = ['input', 'print', 'len', 'range', 'int', 'float', 'str'];
    const random = ['random'];
    const matter = [
      'World',
      'Circle',
      'Rectangle',
      'Polygon',
      'Label',
      'setGravity',
    ];
    const parameters = [
      'isStatic',
      'restitution',
      'fillStyle',
      'image',
      'strokeStyle',
      'lineWidth',
    ];

    const suggestions: languages.CompletionItem[] = [];

    math.map(label => {
      suggestions.push({
        label,
        kind: languages.CompletionItemKind.Function,
        insertText: `${label}(\${1})`,
        insertTextRules: languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range,
      });
    });

    python.map(label => {
      suggestions.push({
        label,
        kind: languages.CompletionItemKind.Function,
        insertText: `${label}(\${1})`,
        insertTextRules: languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range,
      });
    });

    random.map(label => {
      suggestions.push({
        label,
        kind: languages.CompletionItemKind.Function,
        insertText: `${label}(\${1})`,
        insertTextRules: languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range,
      });
    });

    matter.map(label => {
      suggestions.push({
        label,
        kind: languages.CompletionItemKind.Constructor,
        insertText: `${label}(\${1})`,
        insertTextRules: languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range,
      });
    });

    parameters.map(label => {
      suggestions.push({
        label,
        kind: languages.CompletionItemKind.Property,
        insertText: `${label}=`,
        range,
      });
    });
    return { suggestions: suggestions };
  },
});

languages.register({ id: 'puppyConsoleLanguage' });

languages.setMonarchTokensProvider('puppyConsoleLanguage', {
  tokenizer: {
    root: [[/"[^"]*"/, 'string']],
  },
});

const zenkaku =
  '[！　”＃＄％＆’（）＊＋，－．／：；＜＝＞？＠［＼￥］＾＿‘｛｜｝～￣' +
  'ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ' +
  'ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ' +
  '１２３４５６７８９０' +
  '｡｢｣､･ｦｧｨｩｪｫｬｭｮｯｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾉﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝﾞﾟ]';

const checkZenkaku = (
  codeEditor: CodeEditor,
  decos: string[],
  setDecos: (decos: string[]) => void
) => {
  const zenkakuRanges = codeEditor
    .getModel()!
    .findMatches(zenkaku, true, true, false, null, false);
  const _decos: editor.IModelDeltaDecoration[] = zenkakuRanges.map(
    (match: editor.FindMatch) => ({
      range: match.range,
      options: { inlineClassName: 'zenkakuClass' },
    })
  );
  setDecos(codeEditor.deltaDecorations(decos, _decos));
};

export const onChange = (
  codeEditor: CodeEditor | null,
  setSource: (source: string) => void,
  decos: string[],
  setDecos: (decos: string[]) => void,
  puppy: PuppyVM | null,
  codeChangeTimer: NodeJS.Timer | null,
  setCodeChangeTimer: React.Dispatch<React.SetStateAction<NodeJS.Timer | null>>,
  setEditorTheme: React.Dispatch<React.SetStateAction<string>>,
  saveSessionStorage: (source: string) => void
) => (source: string, _event: editor.IModelContentChangedEvent) => {
  if (codeEditor) {
    checkZenkaku(codeEditor, decos, setDecos);
  }
  setSource(source);
  if (codeChangeTimer) {
    clearTimeout(codeChangeTimer);
  }
  if (puppy) {
    setCodeChangeTimer(
      setTimeout(() => {
        saveSessionStorage(source);
        try {
          if (puppy.load(source, false)) {
            setEditorTheme('vs');
            return true;
          } else {
            setEditorTheme('error');
            return false;
          }
        } catch (e) {
          console.log(e);
          setEditorTheme('error');
          return false;
        }
      }, 1000)
    );
  }
};

export const editorDidMount = (setEditor: (editor: CodeEditor) => void) => (
  editor: CodeEditor
) => {
  setEditor(editor);
};

export const fontPlus = (
  fontSize: number,
  setFontSize: (fontSize: number) => void
) => () => {
  setFontSize(fontSize + 3);
};

export const fontMinus = (
  fontSize: number,
  setFontSize: (fontSize: number) => void
) => () => {
  setFontSize(Math.max(12, fontSize - 3));
};

export const setModelMarkers = editor.setModelMarkers;

type LogType = 'error' | 'info' | 'warning' | 'hint';

const type2severity = (type: LogType) => {
  switch (type) {
    case 'error':
      return MarkerSeverity.Error;
    case 'info':
      return MarkerSeverity.Info;
    case 'warning':
      return MarkerSeverity.Warning;
    case 'hint':
      return MarkerSeverity.Hint;
  }
};

export const ErrorLogs2Markers = (logs: ErrorLog[]): editor.IMarkerData[] =>
  logs.map(log => ({
    severity: type2severity(log.type as LogType),
    startLineNumber: log.row + 1,
    startColumn: log.col!,
    endLineNumber: log.row! + 1,
    endColumn: log.col! + log.len!,
    code: log.key,
    message: messagefy(log),
  }));

export const setErrorLogs = (codeEditor: CodeEditor | null) => (
  type: LogType
) => (logs: ErrorLog[]) => {
  if (logs.length > 0) {
    logs.map(log => {
      Object.keys(log).forEach(key => {
        if (log[key] === undefined) {
          log[key] = null;
        }
      });
    });
    add_log(
      {
        type: 'compile-error',
        value: logs,
      },
      new Date()
    );
  }
  if (codeEditor) {
    setModelMarkers(codeEditor.getModel()!, type, ErrorLogs2Markers(logs));
  }
};

export const setCodeHighLight = (
  setHighLight: React.Dispatch<React.SetStateAction<string[]>>,
  codeEditor: CodeEditor
) => (startLineNum: number, endLineNum: number) => {
  setHighLight(hl =>
    codeEditor.deltaDecorations(hl, [
      {
        range: new Range(startLineNum, 1, endLineNum, 1),
        options: { isWholeLine: true, className: 'code-highlight' },
      },
    ])
  );
};

export const resetCodeHighLight = (
  setHighLight: React.Dispatch<React.SetStateAction<string[]>>,
  codeEditor: CodeEditor
) => () => {
  setHighLight(hl => codeEditor.deltaDecorations(hl, []));
};
