
from odoo import api, fields, models



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
        chair_id = chair.pop('id', False)
        if chair_id:
            self.browse(chair_id).write(chair)
        else:
            chair_id = self.create(chair).id
        return chair_id

