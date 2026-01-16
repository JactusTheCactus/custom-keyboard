#include <iostream>
#include <fstream>
#include <sstream>
#include <json.hpp>
using json = nlohmann::json;
json read_json(const std::string &filepath);
