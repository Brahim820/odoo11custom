
from odoo import api, fields, models


class Testing(models.Model):
    _inherit='pos.config'

    testing_var = fields.Boolean(default=False, string="Testing Fields")


class TableChair(models.Model):

    _name='table.chair'

    name = fields.Char(string="Chair Name", help="Name Of Chair Which Will Be Displayed On Pos Widget")
    active = fields.Boolean(String="Active", default=True)


    @api.model
    def create_from_ui(self, chair):
        """ create or modify a table from the point of sale UI.
            table contains the table's fields. If it contains an
            id, it will modify the existing table. It then
            returns the id of the table.
        """
        print(chair)
        # print(chair.pop('id', False))
        chair_id = chair.pop('id', False)
        print(chair)
        if chair_id:
            self.browse(chair_id).write(chair)
        else:
            chair_id = self.create(chair).id
        return chair_id

class Chair(models.Model):
    _inherit = "pos.order.line"


    chair=fields.Char(string="Chair", help="Chair for serving")