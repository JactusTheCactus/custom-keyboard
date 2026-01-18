#include "read_json.hpp"
json read_json(const std::string &filepath)
{
	std::ifstream file(filepath);
	if (!file.is_open())
	{
		std::cerr << "Error: Could not open the file '" << filepath << '\'' << std::endl;
		return json::parse("{}");
	}
	std::stringstream buffer;
	buffer << file.rdbuf();
	file.close();
	return json::parse(buffer.str());
}
