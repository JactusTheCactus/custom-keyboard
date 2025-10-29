HTML=""
STYLE=(
	"body {font: 20px \"Inter\"}"
	"code {font: 1em \"Fira Code\"}"
)
HTML+="<style>"
HTML+="@import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@300..700&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap');"
for i in "${STYLE[@]}"; do
	HTML+="$i"
done
HTML+="</style>"
for FILE in layouts/*.json; do
	HTML+="<h1>$(jq -r .title $FILE)</h1>"
	HTML+="<pre><code>"
	mapfile -t ROWS < <(jq -r .onScreen.main[] $FILE)
	for ROW in "${ROWS[@]}"; do
		HTML+="$ROW<br>"
	done
	HTML=${HTML%"<br>"}
	HTML+="</code></pre>"
done
echo "$HTML" > index.html