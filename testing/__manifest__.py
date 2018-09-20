# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.


{
    'name': 'Pos Test Success',
    'version': '1.0',
    'category': 'Point of Sale',
    'sequence': 6,
    'summary': 'Restaurant extensions for the Point of Sale ',
    'description': """

This module adds several restaurant features to the Point of Sale:
- Bill Printing: Allows you to print a receipt before the order is paid
- Bill Splitting: Allows you to split an order into different orders
- Kitchen Order Printing: allows you to print orders updates to kitchen or bar printers

""",
    'depends': ['point_of_sale'],
    # 'website': 'https://www.odoo.com/page/point-of-sale',
    'data': [
            'views/test.xml',
            'views/test_template.xml',
    ],
    'qweb': [
        'static/src/xml/test_stat.xml',

    ],
    'installable': True,
    'auto_install': False,
}
