HTML=""
HTML+="<style>"
HTML+="@import url('https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,100..900;1,100..900&display=swap');"
HTML+="body{font:20pt\"Noto Sans\",sans-serif}"
HTML+="li{white-space:pre}"
HTML+="</style>"
for FILE in layouts/*.json; do
	HTML+="<h1>$(jq -r .title $FILE)</h1>"
	HTML+="<ul>"
	mapfile -t ROWS < <(jq -r .onScreen.main[] $FILE)
	for ROW in "${ROWS[@]}"; do
		if [ "$FILE" = "layouts/qwerty.json" ]; then
			ROW="$(echo "$ROW" | perl -CS -pe 's/(\x{0301}|\x{0308}|\x{030c})/\x{25cc}$1/g')"
		fi
		ROW="$(echo "$ROW" | perl -CS -pe 's/(\x{0323})/\x{25cc}$1/g')"
		RE=(
			"s/>/&gt;/g"
			"s/</&lt;/g"
			"s/\{/&lbrace;/g"
			"s/\}/&rbrace;/g"
		)
		for re in "${RE[@]}"; do
			ROW="$(echo "$ROW" | perl -CS -pe $re)"
		done
		HTML+="<li>$ROW</li>"
	done
	HTML=${HTML%"<br>"}
	HTML+="</ul>"
done
RE=(
	"s/\x{00C6}/&AElig;/g"
	"s/\x{00E6}/&aelig;/g"
)
for re in "${RE[@]}"; do
	HTML="$(echo "$HTML" | perl -CS -pe $re)"
done
echo "$HTML" > index.html