exec > index.html
STYLE=(
	"body {font: 20px \"Inter\"}"
	"code {font: 1em \"Fira Code\"}"
)
echo "<style>"
for i in "${STYLE[@]}"; do
	echo "$i"
done
echo "</style>"
for FILE in layouts/*.json; do
	echo "<h1>$(jq -r .title $FILE)</h1>"
	echo "<ul>"
	mapfile -t ROWS < <(jq -r .onScreen.main[] $FILE)
	for ROW in "${ROWS[@]}"; do
		echo "<li><code>$ROW</code></li>"
	done
	echo "</ul>"
done