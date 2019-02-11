#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Thu Nov  1 11:26:01 2018

@author: s1881079
"""

#!/usr/bin/env python3
import cx_Oracle
import cgi
import cgitb
cgitb.enable()

basic_html = '''
Content-Type: text/html
<!DOCTYPE html>
'''

head_html = '''
<head>
    <title>{cnt_title}</title>
</head>
'''

head_html = head_html.format(cnt_title = "this is the title")

body_strtag = '''
<body>
'''

body_endtag = '''
</body>
'''

html_endtag = '''
</html>
'''

conn = cx_Oracle.connect("s1881079/exp_s1881079")
c = conn.cursor()
c.execute('SELECT * FROM MY_FIELDS')



print(basic_html)
print(head_html)
print(body_strtag)

for row in c:
     print(row[0],"-",row[1])
conn.close()

print(body_endtag)
print(html_endtag)