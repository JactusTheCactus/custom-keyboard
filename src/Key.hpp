#include "fmt.hpp"
class Key
{
private:
	json obj;

public:
	json value;
	std::string type;
	int size;
	Key(json j);
	std::string to_string();
};
