# -*- coding: utf-8 -*-
from odoo import http
from odoo.http import Response
import json

class Trytest(http.Controller):

    @http.route('/trytest/200', auth='public')
    def fn_200(self, **kw):
    	return Response("200",200)   


    @http.route('/trytest/202/', auth='public')
    def fn_202(self, **kw):  
    	d={}
    	d['a']="hello"
    	d['b']="asdfa"  	
    	return Response(json.dumps(d),202)  

     

class Externalapi(http.Controller):
    @http.route('/externalapi/externalapi/', auth='public')
    def index(self, **kw):
        return "Hello, world"

    # @http.route('/externalapi/externalapi/objects/', auth='public')
    # def list(self, **kw):
    #     return http.request.render('externalapi.listing', {
    #         'root': '/externalapi/externalapi',
    #         'objects': http.request.env['externalapi.externalapi'].search([]),
    #     })

#     @http.route('/externalapi/externalapi/objects/<model("externalapi.externalapi"):obj>/', auth='public')
#     def object(self, obj, **kw):
#         return http.request.render('externalapi.object', {
#             'object': obj
#         })