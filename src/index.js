export default {
  async fetch(request, env) {
    const { pathname, searchParams } = new URL(request.url);

	let headers = {
				  'Access-Control-Allow-Origin': '*', // Or your specific origin
				  'content-type': 'application/json;charset=UTF-8',
	}

    let dbresults = [];
    if (pathname === "/api/select_all") {
      const { results } = await env.DB.prepare(
        "SELECT * FROM books LIMIT ?, 10",
      )
		.bind(searchParams.get("index"))
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
        "select * from books where name like ?;",
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
		const { results1 } = await env.DB.prepare(
        	"select * from books where name = ?;",
      	)
        .bind(`${searchParams.get("book_name")}`)
        .all();
		if (results1 !== undefined) {
			const {results} = await env.DB.prepare(
				"delete from books where name = ?;",
			)
				.bind(`${searchParams.get("book_name")}`)
				.all();
			return Response.json({code: 200, data: null, msg: "删除成功"}, {
				headers: headers
			});
		}
		else{
			return Response.json({code: 500, data: null, msg: "未找到书籍"}, {
				headers: headers
			});
		}
    }

    if (pathname === "/api/insert_book"
       && searchParams.has("name")
		&& searchParams.has("author")
      ){
		try {
			const {results} = await env.DB.prepare(
				"insert into books (name, author, publisher, keyword, excerpt, category_num, publish_date) values (?, ?, ?, ?, ?, ?, ?)",
			)
				.bind(
					searchParams.get("name"),
					searchParams.get("author"),
					searchParams.get("publisher"),
					searchParams.get("keyword"),
					searchParams.get("excerpt"),
					searchParams.get("category_num"),
					searchParams.get("publish_date")
				)
				.all();
			return {
				code: 200,
				data: null,
				msg: "插入成功"
			};
		}
		catch (error){
			return {
				code: 500,
				data: null,
				msg: "插入失败，请检查参数"
			};
		}
    }
    if (dbresults.length !== 0){
		const responseObject = {
			code: 200,
			data: dbresults
		};
		let resp = Response.json(responseObject, {
			headers: headers
		});
    	return resp;
    }
	else
		return Response.json({code: 404, data: null}, {
				headers: headers
		});
  },
}
