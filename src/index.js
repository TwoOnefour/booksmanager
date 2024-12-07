export default {
  async fetch(request, env) {
    const { pathname, searchParams } = new URL(request.url);
    
    if (pathname === "/api/select_all") {
      const { results } = await env.DB.prepare(
        "SELECT name,author,publisher,publish_date FROM books",
      )
        .all();
      return Response.json(results);
    }
    if (pathname === "/api/select_book_by_index"
       && searchParams.has("index")
      ){
      const { results } = await env.DB.prepare(
        "SELECT * FROM books LIMIT ?, 1",
      )
        .bind(searchParams.get("index"))
        .all();
      return Response.json(results);
    }
    return new Response(
      "404 not found.",
    );
  },
}
