##uncomment one by one for understanding following
import xmlrpclib
import csv
server = "http://localhost:8069"
db = "odoo11"
## user name : used for login localhost odoo & password
user = "lalit.kumar@prolitus.com"
password = "odoo11"
common = xmlrpclib.ServerProxy('%s/xmlrpc/2/common' % server)
print(common.version())



# authenticating
uid = common.authenticate(db,user,password,{})
print(uid)

#for accessing models created OdooApi
OdooApi = xmlrpclib.ServerProxy('%s/xmlrpc/2/object' % server)

## accessing models
# user_count = OdooApi.execute_kw(db,uid,password,'res.users','search_count',[[]])
# print(user_count)


# # filter data
# filter = [[('login','=','lalit.kumar@prolitus.com')]]
# contact_creation = OdooApi.execute_kw(db,uid,password,'res.users','search_count',filter)
# print(contact_creation)

# # import data from csv
# file = "importdata.csv"
# reader = csv.reader(open(file,'rb'))
# for row in reader:
# 	print(row)

# #load to odoo
# file = "importdata.csv"
# reader = csv.reader(open(file,'rb'))
# for row in reader:
# 	name = row[0]
# 	login = row[1]
# 	print(name)
# 	print(login)
# 	record = [{'name':name,'login':login}]
# 	OdooApi.execute_kw(db,uid,password,'res.users','create',record)


# # prevent duplicate data i.e, duplicate data again and again if re run
# # howsoever in our case login is unique so error will be raised
# file = "importdata.csv"
# reader = csv.reader(open(file,'rb'))
# for row in reader:
# 	name = row[0]
# 	login = row[1]
# 	filter = [[('login','=',login)]]
# 	login_id = OdooApi.execute_kw(db,uid,password,'res.users','search',filter)
# 	if login_id:
# 		print('already exists')
# 	else:
# 		print('adding {}'.format(row))
# 		record = [{'name':name,'login':login}]
# 		OdooApi.execute_kw(db,uid,password,'res.users','create',record)


# #search
# file = "importdata.csv"
# reader = csv.reader(open(file,'rb'))
# filter = [[('name','=','App Store')]]
# # searched actions and got that record id
# action_id = OdooApi.execute_kw(db,uid,password,'ir.actions.actions','search',filter)
# # user_id returning id
# # print(action_id[0])

# for row in reader:
# 	name = row[0]
# 	login = row[1]
# 	filter = [[('login','=',login)]]
# 	login_id = OdooApi.execute_kw(db,uid,password,'res.users','search',filter)
# 	if login_id:
# 		print('already exists')
# 	else:
# 		print('adding {}'.format(row))
# 		# set the many2one field with required action id searched above
# 		record = [{'name':name,'login':login,'action_id':action_id[0]}]
# 		OdooApi.execute_kw(db,uid,password,'res.users','create',record)


# #overwrite
# file = "importdata.csv"
# reader = csv.reader(open(file,'rb'))
# filter = [[('name','=','App Store')]]
# # searched actions and got that record id
# action_id = OdooApi.execute_kw(db,uid,password,'ir.actions.actions','search',filter)
# # user_id returning id
# # print(action_id[0])

# for row in reader:
# 	name = row[0]
# 	login = row[1]
# 	filter = [[('login','=',login)]]
# 	login_id = OdooApi.execute_kw(db,uid,password,'res.users','search',filter)
# 	if login_id:
# 		print('already exists so updating')
# 		record = {'action_id':action_id[0]}
# 		OdooApi.execute_kw(db,uid,password,'res.users','write',[login_id,record])

# 		# either as in above if OR
# 		# record = [login_id,{'action_id':action_id[0]}]
# 		# OdooApi.execute_kw(db,uid,password,'res.users','write',record)
# 	else:
# 		print('adding {}'.format(row))
# 		# set the many2one field with required action id searched above
# 		record = [{'name':name,'login':login,'action_id':action_id[0]}]
# 		OdooApi.execute_kw(db,uid,password,'res.users','create',record)