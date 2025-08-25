#!/bin/bash
SCROLL=false
#SCROLL=true
if $SCROLL; then
	clear -x
else
	clear
fi
python3 script.py