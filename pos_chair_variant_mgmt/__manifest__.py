# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.


{
    'name': 'Pos Chair And Varient Mgmt',
    'version': '1.0',
    'category': 'Point of Sale',
    'sequence': 6,
    'summary': 'Chair and management extensions for the Point of Sale restaurant ',
    'description': """

This module adds several restaurant features to the Point of Sale:
- Add Chair: Allow you to assign perticular chair for a order item
- Add Separator: Allows you to separate order items for diffrent courses
- Varient Selecting: allows you to select varient of a product before adding it to orderline

""",
    'depends': ['point_of_sale','pos_restaurant'],
    # 'website': 'https://www.odoo.com/page/point-of-sale',
    'data': [
            'views/pos_chair_variant.xml',
            'views/pos_chair_variant_template.xml',
    ],
    'qweb': [
        'static/src/xml/pos_chair_variant_static.xml',

    ],
    'installable': True,
    'auto_install': False,
}
