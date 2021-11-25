import { useState } from 'react';
import {
    useQuery,
    useMutation,
    useQueryClient,
    QueryClient,
    QueryClientProvider,
  } from 'react-query'
  import { ReactQueryDevtools } from "react-query/devtools";

  const queryClient = new QueryClient();
  const  Todos = ({id}) => {
    const { isLoading, error, data, isFetching } = useQuery("gauriData", () =>
    fetch(
      `http://localhost:3004/posts`
    ).then((res) => res.json()),
    { initialData:  
        [
          { "id": 1, "title": "json-server", "author": "typicode" },
          { "id": 2, "title": "json-server2", "author": "typicode" },
          { "id": 3, "title": "json-server2", "author": "typicode" }
        ]
      }
  );

  if (isLoading) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  return (
    <div>
        <h1>Incoming Id {id}</h1>
        {data.map((datum)=>
            <>
                
                <h1>{datum.id}</h1>
                <p>{datum.title}</p>
                <strong>👀 {datum.author}</strong>{" "}
            </>
        )}
      
      <ReactQueryDevtools initialIsOpen />
    </div>
  );

}

export default function A() {
    const [id, setId] = useState(1);

    const onselectionchange = (event) => {
        const selectedValue = event.target.value;
        setId(selectedValue);

    }
    return (
        <h1>
            About US React SSR Page
            <QueryClientProvider client={queryClient}>
                <select onChange={(event) => onselectionchange(event)}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                </select>
                <Todos id={id}/>
            </QueryClientProvider>
        </h1>
    );
}

