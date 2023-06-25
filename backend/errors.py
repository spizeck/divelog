def register_error_handlers(app):
    # Register your custom error handlers here
    # Example:
    @app.errorhandler(404)
    def handle_not_found_error(e):
        return "Page not found", 404

    @app.errorhandler(500)
    def handle_internal_server_error(e):
        return "Internal Server Error", 500
    
    # @app.errorhandler(SomeCustomException)
    # def handle_custom_exception(e):
    #     return "Custom Exception Occurred", 500

class DiveIntegrityError(Exception):
    def __init__(self, message="Dive already exists"):
        self.message = message
        super().__init__(self.message)