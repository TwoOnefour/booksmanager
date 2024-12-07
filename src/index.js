export default {
  async fetch(request, env) {
    const { pathname, searchParams } = new URL(request.url);
    let dbresults = [];
    if (pathname === "/api/select_all") {
      const { results } = await env.DB.prepare(
        "SELECT name,author,publisher,publish_date FROM books",
      )
        .all();
      dbresults = results
    }

    if (pathname === "/api/select_book_by_index"
       && searchParams.has("index")
      ){
      const { results } = await env.DB.prepare(
        "SELECT * FROM books LIMIT ?, 1",
      )
        .bind(searchParams.get("index"))
        .all();
      dbresults = results;
    }

    if (pathname === "/api/select_book"
       && searchParams.has("book_name")
      ){
      const { results } = await env.DB.prepare(
        "select name,author,publisher,publish_date from books where name like ?;",
      )
        .bind(`%${searchParams.get("book_name")}%`)
        .all();
      dbresults = results;
    }

    if (pathname === "/api/precise_select_book"
       && searchParams.has("book_name")
      ){
      const { results } = await env.DB.prepare(
        "select * from books where name = ?;",
      )
        .bind(`${searchParams.get("book_name")}`)
        .all();
      dbresults = results;
    }

    if (pathname === "/api/precise_delete_book"
       && searchParams.has("book_name")
      ){
      const { results } = await env.DB.prepare(
        "select * from books where name = ?;",
      )
        .bind(`${searchParams.get("book_name")}`)
        .all();
      dbresults = results;
    }
    if (dbresults !== null){
		const responseObject = {
			code: 200,
			data: dbresults
		};
		let resp = Response.json(responseObject, {
			headers: {
			  'Access-Control-Allow-Origin': '*', // Or your specific origin
			  'content-type': 'application/json;charset=UTF-8',
			}
		});
    	return resp;
    }
	else
		return new Response(
		  "404 not found.",
		);
  },
}
