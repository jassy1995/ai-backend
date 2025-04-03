class MarkdownFormatter {
  private sectionLevel: number;

  constructor() {
    this.sectionLevel = 0;
  }

  public formatText(text: string): string {
    // Split into lines and remove empty lines at start/end
    let lines: string[] = text.trim().split('\n');

    // Apply all formatting rules
    lines = this._removeExtraBlankLines(lines);
    lines = this._formatHeaders(lines);
    lines = this._formatCodeBlocks(lines);
    lines = this._formatLists(lines);
    lines = this._formatEmphasis(lines);

    // Join lines back together
    return lines.join('\n');
  }

  private _removeExtraBlankLines(lines: string[]): string[] {
    const result: string[] = [];
    let prevBlank: boolean = false;

    for (const line of lines) {
      const isBlank: boolean = !line.trim();
      if (!(isBlank && prevBlank)) {
        result.push(line);
      }
      prevBlank = isBlank;
    }

    return result;
  }

  private _formatHeaders(lines: string[]): string[] {
    const result: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Check if line is a header
      if (line.trim().startsWith('#')) {
        // Add blank line before header if not at start
        if (i > 0 && result[result.length - 1].trim()) {
          result.push('');
        }

        // Ensure single space after #
        const formattedLine = line.replace(
          /#+\s*/,
          (match: string) => match.trim() + ' '
        );
        result.push(formattedLine);

        // Add blank line after header
        if (i < lines.length - 1) {
          result.push('');
        }
      } else {
        result.push(line);
      }
    }

    return result;
  }

  private _formatCodeBlocks(lines: string[]): string[] {
    const result: string[] = [];
    let inCodeBlock: boolean = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.trim().startsWith('```')) {
        // Add blank line before code block if not at start
        if (!inCodeBlock && i > 0 && result[result.length - 1].trim()) {
          result.push('');
        }

        result.push(line);
        inCodeBlock = !inCodeBlock;

        // Add blank line after code block ends
        if (!inCodeBlock && i < lines.length - 1) {
          result.push('');
        }
      } else {
        result.push(line);
      }
    }

    return result;
  }

  private _formatLists(lines: string[]): string[] {
    const result: string[] = [];
    let inList: boolean = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const isListItem: boolean = /^\s*(?:[0-9]+\.|\*|-)\s/.test(line);

      if (isListItem && !inList && i > 0) {
        // Add blank line before list starts
        if (result[result.length - 1].trim()) {
          result.push('');
        }
      } else if (!isListItem && inList) {
        // Add blank line after list ends
        if (line.trim()) {
          result.push('');
        }
      }

      result.push(line);
      inList = isListItem;
    }

    return result;
  }

  private _formatEmphasis(lines: string[]): string[] {
    return lines.map((line) => {
      // Standardize bold syntax
      line = line.replace(/__([^_]+)__/g, '**$1**');
      // Standardize italic syntax
      line = line.replace(/_([^_]+)_/g, '*$1*');
      return line;
    });
  }
}

export default new MarkdownFormatter();
