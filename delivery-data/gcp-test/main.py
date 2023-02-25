
# Main entry point for the cloud function
def say_hello(request):

    try:
        params = request.get_json() 
        name  = params['hello']
        return f"Hey {name}"
    except:
        return f"no params found"