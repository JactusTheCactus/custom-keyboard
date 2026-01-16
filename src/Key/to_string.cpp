#include "../Key.hpp"
std::string Key::to_string()
{
	std::stringstream ss;
	if (size == 1)
	{
		ss << ' ';
	}
	else
	{
		ss << size - 1;
	}
	ss << " : ";
	if (type == "arr")
	{
		std::vector<std::string> arr = value;
		ss << "[XK:";
		for (std::string i : arr)
		{
			ss << fmt(i);
		}
		ss << ']';
	}
	else if (type == "obj")
	{
		std::vector<std::string> dirs = {"c", "w", "n", "e", "s", "nw", "ne", "se", "sw"};
		std::map<std::string, std::string> obj = value;
		ss << "[4D:";
		for (std::string i : dirs)
		{
			try
			{
				ss << fmt(obj.at(i));
			}
			catch (std::out_of_range e)
			{
				ss << ' ';
			}
		}
		ss << ']';
	}
	else if (type == "str")
	{
		std::string str = value;
		ss << fmt(str);
	}
	return ss.str();
}
