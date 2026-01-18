#include "../Key.hpp"
std::string Key::to_string() const
{
	std::stringstream ss;
	if (type == "arr")
	{
		std::vector<std::string> arr = value;
		ss << "[XK:";
		for (std::string i : arr)
			ss << fmt(i);
		ss << ']';
	}
	else if (type == "obj")
	{
		std::vector<std::string> dirs = {"c", "w", "n", "e", "s", "nw", "ne", "se", "sw"};
		std::map<std::string, std::string> obj = value;
		ss << "[4D:";
		std::vector<std::string> chars;
		for (std::string i : dirs)
		{
			try
			{
				chars.push_back(fmt(obj.at(i)));
			}
			catch (std::out_of_range e)
			{
				chars.push_back(" ");
			}
		}
		while (chars.back() == " ")
			chars.pop_back();
		for (std::string i : chars)
			ss << i;
		ss << ']';
	}
	else if (type == "str")
	{
		std::string s = fmt(value);
		bool spec = size > 1 && s.front() != '[' && s.back() != ']';
		if (spec)
			ss << "[4D:";
		ss << s;
		if (spec)
			ss << ']';
	}
	for (int i = 1; i < size; i++)
		ss << "[]";
	return ss.str();
}
