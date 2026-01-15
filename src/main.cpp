#include <iostream>
#include <fstream>
#include <sstream>
#include <string>
#include <json.hpp>
#include <typeinfo>
using json = nlohmann::json;
auto read_json(const std::string &filepath)
{
	std::ifstream file(filepath);
	if (!file.is_open())
	{
		std::cerr << "Error: Could not open the file '" << filepath << "'" << std::endl;
		return json::parse("{}");
	}
	std::stringstream buffer;
	buffer << file.rdbuf();
	file.close();
	return json::parse(buffer.str());
}
int main()
{
	std::cout << read_json("config.json")["debug"] << std::endl;
}