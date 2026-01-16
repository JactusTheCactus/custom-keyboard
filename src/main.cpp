#include "Key.hpp"
int main()
{
	json data = read_json(std::getenv("FILE"));
	std::string title = data["title"];
	json layout = data["layout"];
	for (std::vector<json> row : layout)
	{
		for (Key key : row)
		{
			std::cout << key.to_string() << std::endl;
		}
		std::cout << std::endl;
	}
}
