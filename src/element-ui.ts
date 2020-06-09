import Vue from 'vue';
import {Container, Header, Main, Row, Col, Button, ButtonGroup,
    Table, TableColumn, Icon, Link, Dialog, DatePicker, Switch, Form, FormItem, 
    Select, Option, Input, Card, Tooltip, Tag, Tabs, TabPane, 
    Upload, Alert, Notification, Message, MessageBox, Image} from 'element-ui';

Vue.use(Container);
Vue.use(Header);
Vue.use(Main);
Vue.use(Row);
Vue.use(Col);
Vue.use(Button);
Vue.use(ButtonGroup);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Icon);
Vue.use(Link);
Vue.use(Dialog);
Vue.use(DatePicker);
Vue.use(Switch);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Select);
Vue.use(Option);
Vue.use(Input);
Vue.use(Card);
Vue.use(Tooltip);
Vue.use(Tag);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Upload);
Vue.use(Alert);
Vue.use(Image);

Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$notify = Notification;
Vue.prototype.$message = Message;
