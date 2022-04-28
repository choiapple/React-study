import logo from './logo.svg';
import './App.css';
import {useState} from 'react';
// 리액트에서 사용자 정의 태그를 할때는 대문자로 시작해야함
// 이걸 컴포넌트라고 함
function Article(props){
  return <article>
    <h2>{props.title}</h2>
    {props.body}
  </article>
}
// 이걸통해서 한번에 고칠수있고 다른사람이 쓸수있게도 하고 내가 쓸수도있음 생산성을 높일수있음
// 컴포넌트를 통해 생산성과 유지, 보수를 획기적으로 높일 수 있다.
function Header(props){
  console.log('props',props, props.title);
  return <header>
    <h1><a href="/" onClick={(event)=>{ //function과 같은 기능
      event.preventDefault();
      props.onChangeMode();
    }}>{props.title}</a></h1>
  </header> 
}
function Nav(props){
  const lis = []
  for(let i=0; i<props.topics.length; i++){
    let t = props.topics[i];
    lis.push(<li key={t.id}>
      <a id={t.id} href={'/read'+t.id} onClick={(event)=>{
        event.preventDefault();//리로드되지않게 하기위해서 하는거
        props.onChangeMode(Number(event.target.id));
      }}>{t.title}</a>
      </li>)
  }
  return <nav>
    <ol>
      {lis}
    </ol>
  </nav>
}

function Create(props){
  return <article>
    <h2>Create</h2>
    <form onSubmit={event=>{
      event.preventDefault();
      const title = event.target.title.value;
      const body = event.target.body.value;
      props.onCreate(title, body);
    }}>
      <p><input type="text" name="title" placeholder="title"/></p>
      <p><textarea name="body" placeholder="body"></textarea></p>
      <p><input type="submit" value="create"></input></p>
    </form>
  </article>
}

function Update(props){
  const [title, setTitle] = useState(props.title);
  const [body, setBody] = useState(props.body);
  return <article>
    <h2>Update</h2>
    <form onSubmit={event=>{
      event.preventDefault();
      const title = event.target.title.value;
      const body = event.target.body.value;
      props.onUpdate(title, body);
    }}>
      <p><input type="text" name="title" placeholder="title" value={title} onChange={event=>{
        // console.log(event.target.value);
        setTitle(event.target.value);
      }}/></p>
      <p><textarea name="body" placeholder="body" value={body} onChange={event=>{
        setBody(event.target.value);
      }}></textarea></p>
      <p><input type="submit" value="Update"></input></p>
    </form>
  </article>
}

function App() {
  const _mode = useState('WELCOME');
  // const mode = _mode[0];
  // const setMode = _mode[1];
  // console.log('_mode', _mode);
  const [mode, setMode] = useState('WELCOME'); // 위의 세줄과 똑같은 코드
  const [id, setId] = useState(null);
  const [nextId, setNextId] = useState(4);
  const [topics, setTopics] = useState([
    {id:1, title:'html', body:'html is ...'},
    {id:2, title:'css', body:'css is ...'},
    {id:3, title:'javascript', body:'javascript is ...'}
  ]);
  let content = null;
  let contextControl = null;
  if(mode === 'WELCOME'){
    content = <Article title="Welcome" body="Hello, WEB"></Article>
  }else if(mode === 'READ'){
    let title, body = null;
    for(let i=0; i<topics.length; i++){
      console.log(topics[i].id, id);
      if(topics[i].id === id){
        title = topics[i].title;
        body = topics[i].body;
      } 
    }
    content = <Article title={title} body={body}></Article>
    contextControl = <>
      <li><a href={'/update/'+id} onClick={event=>{
        event.preventDefault();
        setMode('UPDATE');
      }}>Update</a></li>
      <li><input type="button" value="Delete" onClick={()=>{
        const newTopics = []
        for(let i=0;i<topics.length; i++){
          if(topics[i].id !== id){
            newTopics.push(topics[i]);
            // id가 아닌걸 넣어서 이걸 다시 topics에 다시 넣어주는거임
          }
        }
        setTopics(newTopics);
        setMode('WELCOME');
      }}></input></li>
    </>
  }else if(mode === 'CREATE'){
    content = <Create onCreate={(_title, _body)=>{
      const newTopic = {id:nextId, title:_title, body:_body}
      const newTopics = [...topics];
      newTopics.push(newTopic);
      setTopics(newTopics);
      // newTopic을 topics를 복제한 newTopics에 넣어서 이걸
      // setTopics해주면 같은지 다른지 판별해서 바꿔줌
      // 복제할때 배열들을 복제하려면 []를 사용하고 그냥 원소를 복제하려면{}를
      // 사용하면됨 ...topic해야함 ...이 필요함
      setMode('READ');
      setId(nextId);
      setNextId(nextId+1);
      // setId(nextId) 를 추가한 이유는 
      // 예를 들어서 우리가 react, react is ... 입력하고 submit 버튼을 누르면, 
      // <Nav>태그에 4. react가 새로 생길건데, 
      // 해당 버튼을 눌렀을 때 페이지로 새로 렌더링(새로고침)하기 위함입니다.
    }}></Create>
  }else if(mode === 'UPDATE'){
    let title, body = null;
    for(let i=0; i<topics.length; i++){
      console.log(topics[i].id, id);
      if(topics[i].id === id){
        title = topics[i].title;
        body = topics[i].body;
      } 
    }
    content = <Update title={title} body={body} onUpdate={(title, body)=>{
      // console.log(title, body);
      const newTopics = [...topics]
      const updatedTopic = {id:id, title:title, body:body}
      for(let i=0; i<newTopics.length; i++){
        if(newTopics[i].id === id){
          newTopics[i] = updatedTopic;
          break;
        }
      }
      setTopics(newTopics);
      setMode('READ');
    }}></Update>
  }
  return (
    <div className="App">
      <Header title="WEB" onChangeMode={function(){
        setMode('WELCOME');
    }}></Header>
      <Nav topics = {topics} onChangeMode={(_id)=>{
        setMode('READ');
        setId(_id);
      }}></Nav>
      {content}
      <ul>
        <li><a href="/create" onClick={event=>{
          event.preventDefault();
          setMode('CREATE');
        }}>Create</a></li>
        {contextControl}
      </ul>
    </div>
  );
}

export default App;
// 시작할때 npm start
// 끝날때는 control + c

// component는 입력과 출력이 있다.
// 입력: prop
// 출력: return 값
// prop을 통해서 입력된 데이터를 우리가 만든 함수가 처리해서 return 값을 만들면 
// 그 return 값이 새로운 UI가 된다.

// -state
// prop과 함께 component함수를 다시 실행시켜 새로운 return값을 만들어주는 또하나의 데이터

// -prop, state 공통점
// prop과 state 모두 이 값이 변경되면 새로운 return 값을 만들어서 UI를 바꾼다.

// -prop, state 차이점
// prop: component를 사용하는 외부자를 위한 데이터
// state: component를 만드는 내부자를 위한 데이터

// -const [state, setState] = useState
// //useState는 React 16.8버전부터 추가된 Hook 중 하나로 
// class component를 작성하지 않아도 state를 함수 component안에서 사용할 수 있게 해준다. 

// setState라는 함수를 통해 state 업데이트 하고 새로고침 없이 component를 rendering 해준다.


