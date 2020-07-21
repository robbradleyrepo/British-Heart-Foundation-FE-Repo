function Navitem(props) {
  return (
    <li class="bhf-nav__item">
      <h1>{props.title}</h1>
      <p>URL: {props.link}</p>
    </li>
  );
}

var app = (
  <div>
    <ul>
      <Navitem title="Nav item 1" link="http://hyperlink1" />
      <Navitem title="Nav item 2" link="http://hyperlink2" />
    </ul>
  </div>
);

ReactDOM.render(app, document.querySelector('.bhf-nav'));