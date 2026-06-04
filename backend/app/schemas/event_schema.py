from marshmallow import Schema, fields, validate

class EventSchema(Schema):
    id = fields.Int(dump_only=True)
    title = fields.String(required=True, validate=validate.Length(min=3, max=100))
    description = fields.String(required=True)
    date = fields.DateTime(required=True, format='%Y-%m-%d %H:%M:%S')
    location = fields.String(required=True)
    city = fields.String(required=True)
    available_seats = fields.Int(required=True, validate=validate.Range(min=1))
    category = fields.String(required=True)
    price = fields.Float(load_default=0.0, dump_default=0.0)
    poster_path = fields.String(dump_only=True)
    organizer_id = fields.Int(dump_only=True)
