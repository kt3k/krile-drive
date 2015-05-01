#! /usr/bin/env python

import tenjin
from tenjin.helpers import *

import random

EMPTY = '.'
WALL = '1'
FLOOR = '0'

X_MAX = 100
Y_MAX = 100

gate_x = 51
gate_y = 50

def random_tile():
    x = random.random()
    if x < 0.25:
        return WALL
    elif x < 0.7:
        return FLOOR
    else:
        return EMPTY

rows = [[random_tile() for i in range(X_MAX)] for j in range(Y_MAX)]

rows[gate_y][gate_x] = 'X'

title = "Generated Field v.2"

vars = {
    "title": str(title),
    "rows": rows,
    "x": gate_x,
    "y": gate_y
}

print tenjin.Template(input = """<?xml version="1.0" encoding="utf-8"?>
<mapml>
  <title>#{title}</title>
  <tiles>
    <sym class="1" passable="false" />
    <sym class="0" />
    <sym class="." />
    <sym class="X" />
  </tiles>
  <enter>
    <gate name="0" x="#{x}" y="#{y}"/>
  </enter>
  <exit>
    <gate name="X" href="map00.xml#1" />
  </exit>
  <?py for row in rows:
           row_text = ''.join(row) ?>
  <row>#{row_text}</row>
  <?py #endfor ?>
</mapml>""").render(vars)
