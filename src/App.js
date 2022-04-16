import logo from './logo.svg';
import './App.css';
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
  console.log('props',props, props.tile);
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
        props.onChangeMode(event.target.id);
      }}>{t.title}</a>
      </li>)
  }
  return <nav>
    <ol>
      {lis}
    </ol>
  </nav>
}
function App() {
  const topics = [
    {id:1, title:'html', body:'html is ...'},
    {id:2, title:'css', body:'css is ...'},
    {id:3, title:'javascript', body:'javascript is ...'}
  ]
  return (
    <div className="App">
      <Header title="WEB" onChangeMode={function(){
        alert('Header');
    }}></Header>
      <Nav topics = {topics} onChangeMode={(id)=>{
        alert(id);
      }}></Nav>
      <Article title="Welcome" body="Hello, WEB"></Article>
    </div>
  );
}

export default App;
// 시작할때 npm start
// 끝날때는 control + c


