#!/usr/bin/env python3
import cx_Oracle
import cgi
import cgitb
import json
import datetime
import collections
from jinja2 import Environment, FileSystemLoader
cgitb.enable()

class TbObjects:
    def _init_(self,iterable):
        self._update(iterable)

    def update(self,iterable):
        print('need figure out')

    _update = update


class Find:
    grabAll_sql = 'SELECT * FROM GISTEACH.FINDS'
    table_key = ['xCoord','yCoord','type','depth','field_notes']

    def __init__(self,iterable):
        in_id,in_x,in_y,in_type,in_depth,in_field_notes = iterable
        self.id = in_id
        self.xCoord = in_x
        self.yCoord = in_y
        self.type = in_type
        self.depth = in_depth
        self.field_notes = in_field_notes

    def formPointDict(self):
        dict_locItem = {
            'loc_id' : self.id,
            'x' : self.xCoord,
            'y' : self.yCoord,
        }
        return dict_locItem

    def toDict(self):
        list_dictValue = [self.xCoord,self.yCoord,self.type,self.depth,self.field_notes]
        dict_obj = dict(zip(self.table_key,list_dictValue))

        return self.id,dict_obj

class Field:
    grabAll_sql = 'SELECT * FROM GISTEACH.FIELDS'
    table_key = ['lowx','lowy','hix','hiy','area','owner','crop']

    def __init__(self,iterable):
        in_id,in_lowx,in_lowy,in_hix,in_hiy,in_area,in_owner,in_crop = iterable
        self.id = in_id
        self.lowx = in_lowx
        self.lowy = in_lowy
        self.hix = in_hix
        self.hiy = in_hiy
        self.area = in_area
        self.owner = in_owner
        self.crop = in_crop
        self.height = self.hiy - self.lowy
        self.width = self.hix - self.lowx

    def formRectDict(self):
        dict_rectItem = {
            'rect_id' : 'fld_' + str(self.id),
            'rect_x' : self.lowx,
            'rect_y' : self.lowy,
            'rect_height' : self.height,
            'rect_width' : self.width
        }
        return dict_rectItem

    def toDict(self):
        list_dictValue = [self.lowx,self.lowy,self.hix,self.hiy,self.area,self.owner,self.crop]
        dict_obj = dict(zip(self.table_key,list_dictValue))

        return self.id,dict_obj

class ArtefClass:
    grabAll_sql = 'SELECT * FROM GISTEACH.CLASS'
    table_key = ['name','period','use']

    def __init__(self,iterable):
        in_id,in_name,in_period,in_use = iterable
        self.id = in_id
        self.name = in_name
        self.period = in_period
        self.use = in_use

    def toDict(self):
        list_dictValue = [self.name,self.period,self.use]
        dict_obj = dict(zip(self.table_key,list_dictValue))

        return self.id,dict_obj

class Crop:
    grabAll_sql = 'SELECT * FROM GISTEACH.CROPS'
    table_key = ['name','start_of_season','end_of_season']

    def __init__(self,iterable):
        in_id,in_name,in_strss,in_edss = iterable
        self.id = in_id
        self.name = in_name
        self.start_of_season = in_strss
        self.end_of_season = in_edss

    def update_date_to_str(self):
        self.start_of_season = self.start_of_season.strftime('%m-%d-%y')
        self.end_of_season = self.end_of_season.strftime('%m-%d-%y')

    def toDict(self):
        self.update_date_to_str()
        list_dictValue = [self.name,self.start_of_season,self.end_of_season]
        dict_obj = dict(zip(self.table_key,list_dictValue))

        return self.id,dict_obj

def connect_dbs():
    try:
        conn = cx_Oracle.connect("student/train@geosgen")
    except:
        print('Cannot link to database')
        return None

    return conn

def isValidTbKey(table_key):
    if (table_key not in ['find', 'field', 'crop', 'class']):
        print('table keyword given not in range')
        return False
    else:
        return True

def formObjList(cs,table_key):
    if (isValidTbKey(table_key) == False):
        return None
    obj_list = []
    if table_key == 'find':
        for row in cs:
            obj_list.append(Find(row))
    elif table_key == 'field':
        for row in cs:
            obj_list.append(Field(row))
    elif table_key == 'crop':
        for row in cs:
            obj_list.append(Crop(row))
    elif table_key == 'class':
        for row in cs:
            obj_list.append(ArtefClass(row))

    return obj_list

def grab_info(table_key):
    if (isValidTbKey(table_key) == False):
        return None

    qy_switcher = {
            'find' : 'SELECT * FROM GISTEACH.FINDS',
            'field' : 'SELECT * FROM GISTEACH.FIELDS',
            'crop' : 'SELECT * FROM GISTEACH.CROPS',
            'class' : 'SELECT * FROM GISTEACH.CLASS'
            }
    key_switcher = {
            'find' : ['XCOORD','YCOORD','TYPE','DEPTH','FIELD_NOTES'],
            'field' : ['LOWX','LOWY','HIX','HIY','AREA','OWNER','CROP'],
            'crop' : ['NAME','START_OF_SEASON','END_OF SEASON'],
            'class' : ['NAME','PERIOD','USE']
    }
    return qy_switcher.get(table_key), key_switcher.get(table_key)


def getTableFromDB(conn,table_key):
    qy_expr, list_header = grab_info(table_key)
    cs = conn.cursor()
    cs.execute(qy_expr)

    list_obj = formObjList(cs,table_key)
    return list_obj

def gen_listRectField(list_field):
    fieldRect_list = []
    for field in list_field:
        fieldRect_list.append(field.formRectDict())

    return fieldRect_list

def gen_listLocFind(list_find):
    findLoc_list = []
    for find in list_find:
        findLoc_list.append(find.formPointDict())

    return findLoc_list

def gen_jsonFromObjList(list_obj):
    key_list = []
    val_list = []
    for obj in list_obj:
        objKey,objVal = obj.toDict()
        key_list.append(objKey)
        val_list.append(objVal)

    dict_objs = dict(zip(key_list,val_list))
    json_objs = json.dumps(dict_objs)
    return json_objs


conn = connect_dbs()
list_find = getTableFromDB(conn,'find')
list_field = getTableFromDB(conn,'field')
list_crop = getTableFromDB(conn,'crop')
list_class = getTableFromDB(conn,'class')

json_find = gen_jsonFromObjList(list_find)
json_field = gen_jsonFromObjList(list_field)
json_crop = gen_jsonFromObjList(list_crop)
json_class = gen_jsonFromObjList(list_class)

list_fieldRect = gen_listRectField(list_field)
list_findLoc = gen_listLocFind(list_find)
list_lineCoor = range(17)


env = Environment(loader = FileSystemLoader('template'))

template = env.get_template('trynp.html')
print('Content-Type: text/html\n')
print(template.render(
    field_json = json_field,
    find_json = json_find,
    crop_json = json_crop,
    class_json = json_class,
    fieldRect_list = list_fieldRect,
    findLoc_list = list_findLoc,
    lineCoor_list = list_lineCoor
))


def gen_dictCrop(cs,list_header):
    list_content = []
    list_prikey = []
    for row in cs:
        list_row = [0 for i in range(len(row)-1)]
        list_prikey.append(row[0])
        list_row[0] = row[1]
        list_row[1] = row[2].strftime('%m-%d-%y')
        list_row[2] = row[3].strftime('%m-%d-%y')
        dict_content = dict(zip(list_header,list_row))
        list_content.append(dict_content)
    dict_table = dict(zip(list_prikey,list_content))
    #json_table = json.dumps(dict_table)
    return dict_table



def get_dictTable(conn,table_key):
    qy_expr, list_header = grab_info(table_key)
    cs = conn.cursor()
    cs.execute(qy_expr)

    list_content = []
    list_prikey = []
    if table_key == 'crop':
        return gen_dictCrop(cs,list_header)

    for row in cs:
        list_prikey.append(row[0])
        dict_content = dict(zip(list_header,row[1:]))
        list_content.append(dict_content)

    dict_table = dict(zip(list_prikey,list_content))
    #json_table = json.dumps(dict_content)
    return dict_table

def gen_jsonFromDict(dict_table):
    json_table = json.dumps(dict_table)
    return json_table

def gen_listRectField(dict_field):
    #rect_dictkey = ['rect_id','rect_x','rect_y','rect_height','rect_width']
    list_rect = []
    for fieldkey in dict_field:
        field_item = dict_field[fieldkey]
        #print(field_item)
        dict_rectItem = {
            'rect_id' : 'fld_' + str(fieldkey),
            'rect_x' : field_item['LOWX'],
            'rect_y' : field_item['LOWY'],
            'rect_height' : field_item['HIY'] - field_item['LOWY'],
            'rect_width' : field_item['HIX'] - field_item['LOWX']
        }
        list_rect.append(dict_rectItem)

    return list_rect

def gen_listLocFind(dict_find):
    list_loc = []
    for findkey in dict_find:
        find_item = dict_find[findkey]
        dict_locItem = {
            'loc_id' : 'find_' + str(findkey),
            'x' : find_item['XCOORD'],
            'y' : find_item['YCOORD'],
        }
        list_loc.append(dict_locItem)

    return list_loc

list_find = []
list_field = []
list_crop = []
list_class = []

conn = connect_dbs()

dict_find = get_dictTable(conn,'find')
dict_field = get_dictTable(conn,'field')
dict_crop = get_dictTable(conn,'crop')
dict_class = get_dictTable(conn,'class')

json_find = gen_jsonFromDict(dict_find)
json_field = gen_jsonFromDict(dict_field)
json_crop = gen_jsonFromDict(dict_crop)
json_class = gen_jsonFromDict(dict_class)

list_fieldRect = gen_listRectField(dict_field)
list_findLoc = gen_listLocFind(dict_find)
list_lineCoor = range(17)

env = Environment(loader = FileSystemLoader('template'))

template = env.get_template('trynp.html')
print('Content-Type: text/html\n')
print(template.render(
    field_json = json_field,
    find_json = json_find,
    crop_json = json_crop,
    class_json = json_class,
    fieldRect_list = list_fieldRect,
    findLoc_list = list_findLoc,
    lineCoor_list = list_lineCoor,
    crop_dict = dict_crop,
    class_dict = dict_class,
    find_dict = dict_find,
    field_dict = dict_field
))
