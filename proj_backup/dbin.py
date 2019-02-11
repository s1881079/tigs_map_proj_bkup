#!/usr/bin/env python3
import cx_Oracle
import cgi
import cgitb
import json
import datetime
#import collections
import numpy
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
    table_key = ['id','xCoord','yCoord','type','depth','field_notes','bField']

    def __init__(self,iterable):
        '''
        initiate a Find object

        Parameters
        ----------
        self : Find object
        iterable : iterable
            iterable variable used to defind the attributes of Find object

        '''
        in_id,in_x,in_y,in_type,in_depth,in_field_notes = iterable
        self.id = in_id
        self.xCoord = in_x
        self.yCoord = in_y
        self.type = in_type
        self.depth = in_depth
        self.field_notes = in_field_notes
        self.bField = []


    def updateBField(self,bfield_id):
        '''
        append field_id of which this find belonged to
        '''
        self.bField.append(bfield_id)

    def formPointDict(self):
        '''
        form a dictionary containing attributes of svg tag representing location of this architecture find.
        Attributes included: x & y coordinate of find

        Return
        ------
        dicr_locItem : dict

        '''
        dict_locItem = {
            'loc_id' : self.id,
            'loc_x' : self.xCoord,
            'loc_y' : self.yCoord,
        }
        return dict_locItem

    def toDict(self):
        '''
        transfrom this find into dictionary format, using table key as key and attributes as values

        '''
        list_dictValue = [self.id,self.xCoord,self.yCoord,self.type,self.depth,self.field_notes,self.bField]
        dict_obj = dict(zip(self.table_key,list_dictValue))

        return dict_obj

class Field:
    grabAll_sql = 'SELECT * FROM GISTEACH.FIELDS'
    table_key = ['id','lowx','lowy','hix','hiy','area','owner','crop','height','width','cFind']

    def __init__(self,iterable):
        '''
        initiate a Field object

        Parameters
        ----------
        self : Field object
        iterable : iterable
            iterable variable used to defind the attributes of Field object

        '''
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
        self.cFind = []

    def containPt(self,pt_x,pt_y):
        '''
        see whether a point is inside this field
        '''
        if (self.lowx <= pt_x <= self.hix) and (self.lowy <= pt_y <= self.hiy):
            return True
        else:
            return False

    def updateCFind(self,cfind_id):
        '''
        append Find ID of finds contained in this field
        '''
        self.cFind.append(cfind_id)


    def formRectDict(self):
        '''
        form a dictionary containing attributes of svg tag representing location of this field.
        Attributes included: field id, x & y coordinate of the bottom-left corner of the field, height and width

        Return
        ------
        dicr_rectItem : dict

        '''
        dict_rectItem = {
            #'rect_id' : 'fld_' + str(self.id),
            'rect_id' : self.id,
            'rect_x' : self.lowx,
            'rect_y' : self.lowy,
            'rect_height' : self.height,
            'rect_width' : self.width
        }
        return dict_rectItem

    def toDict(self):
        '''
        transfrom this field into dictionary format, using table key as key and attributes as values

        '''
        list_dictValue = [self.id,self.lowx,self.lowy,self.hix,self.hiy,self.area,self.owner,self.crop,self.height,self.width,self.cFind]
        dict_obj = dict(zip(self.table_key,list_dictValue))

        return dict_obj

class ArtefClass:
    grabAll_sql = 'SELECT * FROM GISTEACH.CLASS'
    table_key = ['id','name','period','use']

    def __init__(self,iterable):
        '''
        initiate a ArtefClass object

        Parameters
        ----------
        self : ArtefClass object
        iterable : iterable
            iterable variable used to defind the attributes of ArtefClass object

        '''
        in_id,in_name,in_period,in_use = iterable
        self.id = in_id
        self.name = in_name
        self.period = in_period
        self.use = in_use

    def toDict(self):
        '''
        transfrom this class into dictionary format, using table key as key and attributes as values

        '''
        list_dictValue = [self.id,self.name,self.period,self.use]
        dict_obj = dict(zip(self.table_key,list_dictValue))

        return dict_obj

class Crop:
    grabAll_sql = 'SELECT * FROM GISTEACH.CROPS'
    table_key = ['id','name','start_of_season','end_of_season']

    def __init__(self,iterable):
        '''
        initiate a Crop object

        Parameters
        ----------
        self : Crop object
        iterable : iterable
            iterable variable used to defind the attributes of Crop object

        '''
        in_id,in_name,in_strss,in_edss = iterable
        self.id = in_id
        self.name = in_name
        self.start_of_season = in_strss
        self.end_of_season = in_edss

    def update_date_to_str(self):
        '''
        update start and end season of this crop from date datatype to string
        '''
        self.start_of_season = self.start_of_season.strftime('%m-%d-%y')
        self.end_of_season = self.end_of_season.strftime('%m-%d-%y')

    def toDict(self):
        '''
        transfrom this crop into dictionary format, using table key as key and attributes as values

        '''
        self.update_date_to_str()
        list_dictValue = [self.id,self.name,self.start_of_season,self.end_of_season]
        dict_obj = dict(zip(self.table_key,list_dictValue))

        return dict_obj

def connect_dbs():
    '''
    connect to student database, if fail return none

    Return
    ------
    conn : cx_Oracle.conn
    '''
    try:
        conn = cx_Oracle.connect("student/train@geosgen")
    except:
        print('Cannot link to database')
        return None

    return conn

def isValidTbKey(table_key):
    '''
    see if table_key is in pre-defined key set

    Return
    ------
    bool

    '''
    if (table_key not in ['find', 'field', 'crop', 'class']):
        print('table keyword given not in range')
        return False
    else:
        return True

def formObjList(cs,table_key):
    '''
    transform each line of table read from database into objects according to table_key input

    Parameters
    ----------
    cs : cx_Oracle.cursor
        cursor pointing to table in database
    table_key : str
        string defining the object class needed to be transformed

    Return
    ------
    list
        list of objects

    '''
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
    '''
    return sql command and table header according to table_key given

    '''
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
    '''
    create cursor, extract table from database, transform to object and return list of objects

    '''
    qy_expr, list_header = grab_info(table_key)
    cs = conn.cursor()
    cs.execute(qy_expr)

    list_obj = formObjList(cs,table_key)
    return list_obj

def gen_listRectField(list_field):
    '''
    generate list of dictionary containing svg tag information of field rectangles

    Return
    ------
    list
        list of dictionary of attributes in svg <rect> tag

    '''
    fieldRect_list = []
    for field in list_field:
        fieldRect_list.append(field.formRectDict())

    return fieldRect_list

def gen_listLocFind(list_find):
    '''
    generate list of dictionary containing svg tag information of find points

    Return
    ------
    list
        list of dictionary of attributes in svg <point> tag

    '''
    findLoc_list = []
    for find in list_find:
        findLoc_list.append(find.formPointDict())

    return findLoc_list

def gen_jsonFromObjList(list_obj):
    '''
    generate json for table rows

    '''
    dictObj_list = []
    for obj in list_obj:
        obj_dict = obj.toDict()
        dictObj_list.append(obj_dict)

    json_objs = json.dumps(dictObj_list)
    return json_objs


def spaLink(find_data,field_data):
    '''
    create spatial link between find data anad field data by updating
    field.cFind and  find.bField
    '''
    for field in field_data:
        for find in find_data:
            if field.containPt(find.xCoord,find.yCoord):
                field.updateCFind(find.id)
                find.updateBField(field.id)
            else:
                pass

def genUniOwnerList(field_data):
    all_owner = []
    for field in field_data:
        all_owner.append(field.owner)
    uni_owner = numpy.unique(all_owner)
    uni_owner = uni_owner.tolist()
    return uni_owner

#some extra pictures for find, from the internet - it's not true, but shows the posisblity of storing in the database
find_pics = {
    1:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1547260159890&di=a7a4a8d7c24d95c291d8479e88f00a64&imgtype=0&src=http%3A%2F%2Fbbscache1.artron.net%2Fforum%2Fday_081117%2F20081117_8f42cc0a6f639f5dfad6gQcLaHQvZ3ka.jpg',
    2:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1547260195487&di=4ff0304ed3a0a191fef2c41803052ab0&imgtype=0&src=http%3A%2F%2Fimg2.scimg.cn%2Fuserupload%2Fauction%2Fitems%2F2522%2F407356%2Forig%2F9621e47e556481639a9438a19aa8e262.jpg',
    3:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1547855318&di=ae299a21acfb847db1c17bcc5d7de9c0&imgtype=jpg&er=1&src=http%3A%2F%2Ffile7.gucn.com%2Ffile%2FCurioPicfile%2F20131001%2FGucnP_U287386T402981561380626320336.jpg',
    4:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1547260721430&di=6fc5d79ba9f6045c1121f2bebf1681cd&imgtype=0&src=http%3A%2F%2Ffile7.gucn.com%2Ffile%2FCurioPicfile%2F20140119%2FGucn_20140119255021154302Pic6.jpg',
    5:'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3679120651,1142797718&fm=26&gp=0.jpg',
    6:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1547260383533&di=ee62934b9c42140f41e6b82470e0d4fd&imgtype=0&src=http%3A%2F%2Fpic13.photophoto.cn%2F20091024%2F0039038572670907_b.jpg',
    7:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1547260218754&di=a8a56eb65e5a84b617f5d7fc88a739af&imgtype=0&src=http%3A%2F%2Fphotocdn.sohu.com%2F20131009%2FImg387816154.jpg',
    8:'https://timgsa.baidu.com/timg?image&quality=80&size=b10000_10000&sec=1547250319&di=bd118d47f0329781c486c088ac4670e8&src=http://pic41.photophoto.cn/20161216/0013025595920748_b.jpg'

}

json_findPicUrl = json.dumps(find_pics)

conn = connect_dbs()
list_find = getTableFromDB(conn,'find')
list_field = getTableFromDB(conn,'field')
list_crop = getTableFromDB(conn,'crop')
list_class = getTableFromDB(conn,'class')

spaLink(list_find,list_field)
uni_owner = genUniOwnerList(list_field)

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
    find_list = list_find,
    field_list = list_field,
    crop_list = list_crop,
    class_list = list_class,
    fieldRect_list = list_fieldRect,
    findLoc_list = list_findLoc,
    lineCoor_list = list_lineCoor,
    owner_list = uni_owner,
    find_picUrl = json_findPicUrl
))
