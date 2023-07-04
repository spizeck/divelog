import logging

def register_error_handlers(app):
    
    @app.errorhandler(400)
    def handle_bad_request_error(e):
        logging.error(e)
        return "Bad Request Error", 400
    
    @app.errorhandler(401)
    def handle_unauthorized_error(e):
        logging.error(e)
        return "Unauthorized Error", 401
    
    @app.errorhandler(403)
    def handle_forbidden_error(e):
        logging.error(e)
        return "Forbidden Error", 403
    
    @app.errorhandler(404)
    def handle_not_found_error(e):
        logging.error(e)
        return "Page not found", 404

    @app.errorhandler(405)
    def handle_method_not_allowed_error(e):
        logging.error(e)
        return "Method Not Allowed Error", 405
    
    @app.errorhandler(409)
    def handle_conflict_error(e):
        logging.error(e)
        return "Conflict Error", 409
    
    @app.errorhandler(422)
    def handle_unprocessable_entity_error(e):
        logging.error(e)
        return "Unprocessable Entity Error", 422
    
    @app.errorhandler(429)
    def handle_too_many_requests_error(e):
        logging.error(e)
        return "Too Many Requests Error", 429
    
    @app.errorhandler(500)
    def handle_internal_server_error(e):
        logging.error(e)
        return "Internal Server Error", 500
        
    @app.errorhandler(501)
    def handle_not_implemented_error(e):
        logging.error(e)
        return "Not Implemented Error", 501
    
    @app.errorhandler(502)
    def handle_bad_gateway_error(e):
        logging.error(e)
        return "Bad Gateway Error", 502
    
    @app.errorhandler(503)
    def handle_service_unavailable_error(e):
        logging.error(e)
        return "Service Unavailable Error", 503

class DiveIntegrityError(Exception):
    # This exception is raised when a dive is not unique
    def __init__(self, message="Dive already exists"):
        logging.error(message)
        self.message = message
        super().__init__(self.message)
        
class DiveInfoMissingError(Exception):
    # This exception is raised when some of the dive information is missing
    def __init__(self, message="Dive information is incomplete"):
        logging.error(message)
        self.message = message
        super().__init__(self.message)
        
    