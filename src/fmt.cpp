#include "fmt.hpp"
std::string fmt(const std::string &str, bool k)
{
	static const std::map<std::string, std::string> hash = []
	{
		std::map<std::string, std::string> m;
		std::vector<std::string> data = {"uni.json", "diacritics.json"};
		for (std::string i : data)
			m.merge(read_json(i).get<std::map<std::string, std::string>>());
		return m;
	}();
	std::stringstream ss;
	std::istringstream iss(str);
	std::string part;
	while (std::getline(iss, part, '_'))
	{
		std::map<std::string, std::string>::const_iterator it = hash.find(part);
		if (it != hash.end())
			ss << it->second;
		else
			ss << part;
	}
	std::string s = ss.str().length() > 0
						? ss.str()
						: "_";
	if (utf8_length(s) > 1)
	{
		if (s.front() == '[' && s.back() == ']')
			return s;
		else if (k)
			return "[MC:" + s + ']';
		else
			return s;
	}
	else
		return s;
}
