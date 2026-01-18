#include <unicode/unistr.h>
#include <unicode/ustream.h>
#include <unicode/brkiter.h>
#include "Key.hpp"
int main()
{
	char *file = std::getenv("FILE");
	if (!file)
	{
		std::cerr << "FILE environment variable not set" << std::endl;
		return 1;
	}
	const json &data = read_json(file);
	json keyboard;
	std::string title = data["title"];
	std::vector<std::string> layout;
	for (const std::vector<json> &row : data["layout"])
	{
		std::stringstream ss;
		for (const Key &key : row)
			ss << key.to_string();
		layout.push_back(ss.str());
	}
	std::stringstream ss;
	std::string s;
	bool f = false;
	for (char i : title)
	{
		if (!f)
		{
			if (i != '{')
				ss << i;
			else
				f = true;
		}
		else
		{
			if (i != '}')
				s += i;
			else
			{
				ss << fmt(s, false);
				s = "";
				f = false;
			}
		}
	}
	std::string str;
	keyboard["title"] = icu::UnicodeString::fromUTF8(ss.str())
							.toTitle(nullptr, icu::Locale::getDefault())
							.toUTF8String(str);
	keyboard["onScreen"]["main"] = layout;
	std::cout << keyboard << std::endl;
}
