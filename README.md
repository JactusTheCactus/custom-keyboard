# Quickstart
1. Go to
	1. `Layouts`
	2. `DIY`
	3. <code><kbd>[SPACE]</kbd> Layouts</code>
	4. [+ DIY]
2. Paste the content of `layout.json`
3. Go to
	1. Settings
	2. Misc.
	3. Import | Export
	4. Theme
4. Paste the content of `theme.cfg`
# Customization
To edit the layout, edit the `JSON` files externally and then paste it using the `Layouts` button inside the app. The structure of the `JSON` files is intuitive:
- For a simple pressable button, just use the character itself
- For a swipable button;
	- <code>[4D:&#x2299;&#x21d0;&#x21d1;&#x21d2;&#x21d3;&#x21d7;&#x21d6;&#x21d9;&#x21d8;]</code>
- For a menu;
	- `[XC:123...]`
- For multiple characters as one input;
	- `[MC:123...]`

Some directions may be omitted using a `[SPACE]`