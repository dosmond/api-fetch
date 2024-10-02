/**
 *  I want to be able to create a wrapper around a react query client that gives me a useFetch hook
 * That gives me typesafe access to my api. The client should let me pass in a map of api endpoint paths
 * and their assiciated Request and Response types.
 * 
 * It should also let me pass in a baseUrl so that i don't have to pass it in on each request.
 * 
 * A full usage of the hook should look like this:
 * 
 * const { data, isLoading, isError, error, refetch } = useFetch("v1/auth/signup", options)
 */

