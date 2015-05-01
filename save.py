#! /usr/bin/env python

import sys
import cgi
import cgitb; cgitb.enable()

form = cgi.FieldStorage()

file = form.getfirst('file')
content = form.getfirst('c')
confirm = form.getfirst('confirm')

def render(msg):
    print "content-type: text/html; charset=utf-8"
    print
    print "<plaintext>" + msg


if file == None:
    render("file name not specified.")
    sys.exit()

if confirm != "yes":
    render("""command not confirmed.
nothing has been operated.
file = %(file)s
-----
%(content)s""" % {"file": file, "content": content})
    sys.exit()
else:
    open(file, 'a').write(content)
    render("""write to %(file)s
-----
%(content)s""" % locals())



