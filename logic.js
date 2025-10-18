window.onload = () => {
  // ─── Justifier ─────────────────────────────────────────────────────────── ✦ ─

  "use strict";
  var __classPrivateFieldSet =
    (this && this.__classPrivateFieldSet) ||
    function (receiver, state, value, kind, f) {
      if (kind === "m") throw new TypeError("Private method is not writable");
      if (kind === "a" && !f)
        throw new TypeError("Private accessor was defined without a setter");
      if (
        typeof state === "function"
          ? receiver !== state || !f
          : !state.has(receiver)
      )
        throw new TypeError(
          "Cannot write private member to an object whose class did not declare it"
        );
      return (
        kind === "a"
          ? f.call(receiver, value)
          : f
          ? (f.value = value)
          : state.set(receiver, value),
        value
      );
    };
  var __classPrivateFieldGet =
    (this && this.__classPrivateFieldGet) ||
    function (receiver, state, kind, f) {
      if (kind === "a" && !f)
        throw new TypeError("Private accessor was defined without a getter");
      if (
        typeof state === "function"
          ? receiver !== state || !f
          : !state.has(receiver)
      )
        throw new TypeError(
          "Cannot read private member from an object whose class did not declare it"
        );
      return kind === "m"
        ? f
        : kind === "a"
        ? f.call(receiver)
        : f
        ? f.value
        : state.get(receiver);
    };
  var _MonoJustifier_instances,
    _MonoJustifier_maxLineSize,
    _MonoJustifier_splitHyphen,
    _MonoJustifier_splitChunkEmptySpaceFactor,
    _MonoJustifier_splitIntoParagraphs,
    _MonoJustifier_extractChunksStack,
    _MonoJustifier_splitChunkInHalf,
    _MonoJustifier_putChunksToLines,
    _MonoJustifier_insertSpaces;
  const breakableWordMatcher = /^[\p{L}\p{M}]+$/gu;
  const lineBreakMatcher = /\r?\n/;
  const whiteSpaceMatcher = /\s+/;
  class MonoJustifier {
    constructor(options) {
      var _a;
      _MonoJustifier_instances.add(this);
      _MonoJustifier_maxLineSize.set(this, 40);
      _MonoJustifier_splitHyphen.set(this, "-");
      _MonoJustifier_splitChunkEmptySpaceFactor.set(this, 0.75);
      __classPrivateFieldSet(
        this,
        _MonoJustifier_maxLineSize,
        Math.max(10, options.maxLineSize),
        "f"
      );
      __classPrivateFieldSet(
        this,
        _MonoJustifier_splitChunkEmptySpaceFactor,
        (_a = options.splitChunkEmptySpaceFactor) !== null && _a !== void 0
          ? _a
          : 0.75,
        "f"
      );
    }
    justifyText(input) {
      const paragraphs = __classPrivateFieldGet(
        this,
        _MonoJustifier_instances,
        "m",
        _MonoJustifier_splitIntoParagraphs
      ).call(this, input);
      if (paragraphs.length === 0) {
        return "";
      }
      const justifiedParagraphs = paragraphs.map((paragraphLines) =>
        this.justifyLines(paragraphLines).join("\n")
      );
      return justifiedParagraphs.join("\n\n");
    }
    justifyLines(input) {
      const chunksStack = __classPrivateFieldGet(
        this,
        _MonoJustifier_instances,
        "m",
        _MonoJustifier_extractChunksStack
      ).call(this, input);
      const chunksOnLines = __classPrivateFieldGet(
        this,
        _MonoJustifier_instances,
        "m",
        _MonoJustifier_putChunksToLines
      ).call(this, chunksStack);
      const spacedChunks = __classPrivateFieldGet(
        this,
        _MonoJustifier_instances,
        "m",
        _MonoJustifier_insertSpaces
      ).call(this, chunksOnLines);
      return spacedChunks;
    }
  }
  (_MonoJustifier_maxLineSize = new WeakMap()),
    (_MonoJustifier_splitHyphen = new WeakMap()),
    (_MonoJustifier_splitChunkEmptySpaceFactor = new WeakMap()),
    (_MonoJustifier_instances = new WeakSet()),
    (_MonoJustifier_splitIntoParagraphs =
      function _MonoJustifier_splitIntoParagraphs(input) {
        const lines = input.split(lineBreakMatcher);
        const paragraphs = new Array();
        let currentParagraph = new Array();
        const flushParagraph = () => {
          if (currentParagraph.length > 0) {
            paragraphs.push(currentParagraph);
            currentParagraph = new Array();
          }
        };
        for (const line of lines) {
          if (line.trim().length === 0) {
            flushParagraph();
            continue;
          }
          currentParagraph.push(line);
        }
        flushParagraph();
        return paragraphs;
      }),
    (_MonoJustifier_extractChunksStack =
      function _MonoJustifier_extractChunksStack(lines) {
        const chunks = new Array();
        let cachedSplitChunk = "";
        for (const index in lines) {
          const line = lines[index];
          const lineParts = line.split(whiteSpaceMatcher);
          for (let i = 0; i < lineParts.length; i++) {
            const chunk = lineParts[i];
            if (
              i === lineParts.length - 1 &&
              chunk.endsWith(
                __classPrivateFieldGet(this, _MonoJustifier_splitHyphen, "f")
              )
            ) {
              cachedSplitChunk = chunk.substring(0, chunk.length - 1);
              continue;
            }
            if (chunk != "") {
              chunks.push(cachedSplitChunk + chunk);
              cachedSplitChunk = "";
            }
          }
        }
        return chunks.reverse();
      }),
    (_MonoJustifier_splitChunkInHalf = function _MonoJustifier_splitChunkInHalf(
      chunk,
      availableSpace
    ) {
      const availableSpaceForChunk = availableSpace - 2;
      const headSize = Math.min(availableSpaceForChunk, chunk.length - 3);
      var head = chunk.substring(0, headSize);
      var tail = chunk.substring(headSize);
      return [head, tail];
    }),
    (_MonoJustifier_putChunksToLines = function _MonoJustifier_putChunksToLines(
      chunksStack
    ) {
      const lines = new Array();
      const bufferLength = () => buffer.join(" ").length;
      let buffer = new Array();
      while (chunksStack.length > 0) {
        const chunk = chunksStack.pop();
        const lineSizeWithChunkAdded = bufferLength() + 1 + chunk.length;
        let splittedAChunk = false;
        if (
          lineSizeWithChunkAdded >
          __classPrivateFieldGet(this, _MonoJustifier_maxLineSize, "f")
        ) {
          const emptySize =
            __classPrivateFieldGet(this, _MonoJustifier_maxLineSize, "f") -
            lineSizeWithChunkAdded +
            chunk.length;
          const badness = emptySize / buffer.length;
          const shouldSplitChunk =
            chunksStack.length > 3 &&
            chunk.length >= 6 &&
            emptySize >= 4 &&
            badness >
              __classPrivateFieldGet(
                this,
                _MonoJustifier_splitChunkEmptySpaceFactor,
                "f"
              );
          if (shouldSplitChunk) {
            splittedAChunk = true;
            const [head, tail] = __classPrivateFieldGet(
              this,
              _MonoJustifier_instances,
              "m",
              _MonoJustifier_splitChunkInHalf
            ).call(this, chunk, emptySize);
            chunksStack.push(tail);
            buffer.push(
              head +
                __classPrivateFieldGet(this, _MonoJustifier_splitHyphen, "f")
            );
          }
          lines.push(buffer);
          buffer = new Array();
        }
        if (splittedAChunk === false) {
          buffer.push(chunk);
        }
      }
      if (buffer.length > 0) {
        lines.push(buffer);
      }
      let lastLine = lines[lines.length - 1];
      if (lastLine.length == 1 && lines.length > 1) {
        const lineToTheEnd = lines[lines.length - 2];
        if (lineToTheEnd.length > 1) {
          lines[lines.length - 1] = [lineToTheEnd.pop(), ...lastLine];
        }
      }
      return lines;
    }),
    (_MonoJustifier_insertSpaces = function _MonoJustifier_insertSpaces(lines) {
      const resultLines = new Array();
      for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
        const chunks = lines[lineIndex];
        const spacesNeeded = chunks.length - 1;
        const spaces = new Array();
        const lineLengthWithoutSpaces = chunks.join("").length;
        const emptySpaceSize =
          __classPrivateFieldGet(this, _MonoJustifier_maxLineSize, "f") -
          lineLengthWithoutSpaces;
        const emptyRatio = Math.ceil(
          __classPrivateFieldGet(this, _MonoJustifier_maxLineSize, "f") * 0.15
        );
        for (let j = 0; j < spacesNeeded; j++) {
          spaces.push("");
        }
        if (lineIndex == lines.length - 1 && emptySpaceSize > emptyRatio) {
          resultLines.push(chunks.join(" "));
          continue;
        }
        let insertedSpaces = 0;
        let counter = 0;
        let result = "";
        while (insertedSpaces++ < emptySpaceSize) {
          spaces[counter++ % spacesNeeded] += " ";
        }
        for (let j = 0; j < chunks.length - 1; j++) {
          let spaceIndex = lineIndex % 2 === 0 ? j : spacesNeeded - j - 1;
          result += chunks[j] + spaces[spaceIndex];
        }
        result += chunks[chunks.length - 1];
        resultLines.push(result);
      }
      return resultLines;
    });

  // ─── Window Logic ──────────────────────────────────────────────────────── ✦ ─

  const newLineRegExp = /\n/g;
  const editorElement = document.getElementById("editor");
  const justifyButton = document.getElementById("justify-button");
  const justifier = new MonoJustifier({ maxLineSize: 50 });
  const contentKey = "org.1285.mailing.composer.content";

  // ─── Set Rows To Be The Same As Lines ──────────────────────────────────── ✦ ─

  function setEditorRowsOnChange() {
    const content = editorElement.value;
    const lines = (content.match(newLineRegExp) || []).length;
    editorElement.setAttribute("rows", Math.max(20, lines + 2));

    localStorage.setItem(contentKey, content);
  }

  // ─── On Justify ──────────────────────────────────────────────────────

  function onJustifyContent() {
    editorElement.value = justifier.justifyText(editorElement.value);
    setEditorRowsOnChange();
  }

  // ─── Setting Up Window Events ──────────────────────────────────────────── ✦ ─

  function setupWindowEvents() {
    editorElement.onchange = setEditorRowsOnChange;
    editorElement.onkeyup = setEditorRowsOnChange;
    justifyButton.onclick = onJustifyContent;
  }

  // ─── Main ──────────────────────────────────────────────────────────────── ✦ ─

  editorElement.value = localStorage.getItem(contentKey);
  setupWindowEvents();
};
