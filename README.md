# RapydScript support for VSCode

Adds support for [RapydScript](https://github.com/kovidgoyal/rapydscript-ng)

## Features

-   Syntax highlighting
-   Basic autocompletions with docs
-   Semantic tokenization
-   Linting
-   Code formatting with [Black](https://github.com/psf/black)
-   Compilation

## Requirements

To start hacking you don't need anything at all, everything is builtin apart from `Black`.

## Code formatting

As RapydScript tries to follow Python syntax, so it's possible to use `Black` to format it's source code.
However RapydScript has some constructs that follow JS syntax like anonymous functions:

```python
factorial = def(n):
	if n == 0:
		return 1
	return n * factorial(n-1)
```

or

```js
Array.from(document.querySelectorAll(".cool-div"));
```

Such constructs will confuse `Black` thus resulting in failure. If you care, try to be more "pythonic".
If you don't, format manually.
To apply formatting `Black` must be in your path, as extension calls it directly.

## Compilation

Whenever you open a `.pyj` file a button appears on your status bar.
Click it to compile current file into ready to use JS.
There's no need to compile every single file.
RapydScript is capable of detecting imports so create a single entry point to your app, and then use `from __somelib__ import __somefunc__`, after compilation functionality of both modules will be merged into single JS alongside with RS baselib, and will be ready for deployment.
Minification does not work for now. See known issues below.

## Extension Settings

None for now.

## Known Issues

-   Minification does not work. You'll need extra tool to minify compiled code.
    Luckily there's (plenty)[https://marketplace.visualstudio.com/search?term=minify&target=VSCode&category=All%20categories&sortBy=Relevance]
-   Builtin JS highlighting does not work

## Release Notes

### 0.1.0

Initial release
