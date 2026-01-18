#include "../Key.hpp"
Key::Key(json j)
{
	size = j[0];
	obj = j[1];
	if (obj.is_string())
	{
		type = "str";
		value = std::string(obj);
	}
	if (obj.is_object())
	{
		type = "obj";
		value = std::map<std::string, std::string>(obj);
	}
	if (obj.is_array())
	{
		type = "arr";
		value = std::vector<std::string>(obj);
	}
}
