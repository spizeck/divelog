def register_error_handlers(app):
    # Register your custom error handlers here
    # Example:
    @app.errorhandler(404)
    def handle_not_found_error(e):
        return "Page not found", 404
