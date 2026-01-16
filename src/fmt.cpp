#include "fmt.hpp"
std::string fmt(const std::string &str)
{
	static const std::map<std::string, std::string> hash = []
	{
		std::map<std::string, std::string> m;
		m.merge(read_json("uni.json").get<std::map<std::string, std::string>>());
		m.merge(read_json("diacritics.json").get<std::map<std::string, std::string>>());
		return m;
	}();
	std::stringstream ss;
	std::istringstream iss(str);
	std::string part;
	while (std::getline(iss, part, '_'))
	{
		{
			std::map<std::string, std::string>::const_iterator it = hash.find(part);
			if (it != hash.end())
				ss << it->second;
			else
				ss << part;
		}
	}
	std::size_t len = ss.str().length();
	std::string s = ss.str();
	if (len > 1)
	{
		return "[MC:" + s + "]";
	}
	else
	{
		return s;
	}
}
