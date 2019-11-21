import {
  editor,
  languages,
  Range,
  CancellationToken,
  Position,
} from 'monaco-editor';
import { callKoinu } from './koinu';

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
    const matter = ['World', 'Circle', 'Rectangle', 'Polygon', 'Label'];
    const parameters = [
      'width',
      'height',
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
  setDecos: (decos: string[]) => void
) => (source: string, _event: editor.IModelContentChangedEvent) => {
  if (codeEditor) {
    checkZenkaku(codeEditor, decos, setDecos);
  }
  setSource(source);
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
