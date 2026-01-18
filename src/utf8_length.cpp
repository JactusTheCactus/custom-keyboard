#include "utf8_length.hpp"
int utf8_length(const std::string &s)
{
	int len = 0;
	for (char c : s)
		if ((c & 0xC0) != 0x80)
			len++;
	return len;
}
