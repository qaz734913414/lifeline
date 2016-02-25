/**
 *
 * @author 
 *
 */
class Data {
	public constructor() {
	}
	
	// 当前的状态
    public current = "本科";
	
    // 所有状态， 和状态下对应的问题
    public STATES = [
        {
            name: "本科",
            properties: { health: function(properties) { return 1 },wealth: function(properties) { return -1 },ability: function(properties) { return 1 } },
            questions: [
                {
                    question: "本科干嘛呢？",
                    answers: [
                        { answer: "本科工作",event: "本科工作" },
                        { answer: "本科上课",event: "本科上课" },
                        { answer: "本科打酱油",event: "本科打酱油" }
                    ],
                    left_times: 1,      // 这个问题可以问几次？
                    require: function(properties) { 
                        if(properties.state_year > 3) {
                            return 1;
                        } else { 
                            return 2;
                        }
                    } // 返回1表示必然发生，返回2表示随机发生， 返回3表示不发生
                }
            ]
        },
        {
            name: "职员",
            properties: { health: function(properties) { return 1 },wealth: function(properties) { return -1 },ability: function(properties) { return 1 } },
            questions: [
                {
                    question: "选择一种行为？",
                    answers: [
                        { answer: "职员加薪",event: "职员加薪" },
                        { answer: "职员升职",event: "职员升职" },
                        { answer: "职员喝酒",event: "职员喝酒" },
                        { answer: "职员辞职",event: "职员辞职" }
                    ],
                    left_times: 2,
                    require: function(properties) { return 1 }
                },
                {
                    question: "厌倦工作了吗？",
                    answers: [
                        { answer: "职员无聊",event: "职员加薪" },
                        { answer: "职员放假",event: "职员升职" },
                        { answer: "职员XXX",event: "职员喝酒" },
                        { answer: "职员辞职",event: "职员辞职" }
                    ],
                    left_times: 1,
                    require: function(properties) { return 1 }
                }
            ]
        }
    ];
    
    /**
     * 将状态表示成字典形式
     */
    public getStatesMap(states) {
        var map = {};
        for(var index in states) {
            var state = states[index];
            map[state.name] = state;
        }
        return map;
    }    
    // 状态的字典表示形式
    public STATES_MAP = this.getStatesMap(this.STATES);
    /**
     * 获取当前状态下对属性的改变函数
     */
    public getStatesPropertiesFunctions() {
        return this.STATES_MAP[this.current].properties;
    }
    
    /**
     * 在当前状态下获取一个问题
     */
    public getQuestion(properties) {
        var state = this.STATES_MAP[this.current];
        var questions = state.questions;
        var valid_questions = this.validQuestions(questions,properties);
        var question = this.randomOne(valid_questions);
        return question;
    }
    
    /**
     * 从数组中随机选取一个item
     */ 
    public randomOne(arr) { 
        if(arr.length < 0) {
            return null;
        } else { 
            return arr[Math.floor(Math.random() * arr.length)];
        }
    }
    /**
     * 获取有效的问题列表
     */ 
    public validQuestions(questions, properties) { 
        // TODO: 添加过滤规则
        var res = [];
        // 筛选系统必然事件
        // 筛选随机事件
        for(var index in questions) { 
            var q = questions[index];
            if(q.left_times > 0) {
                if(q.require) {
                    var func = q.require;
                    var ret = func(properties);
                    if(ret == 1) {
                        return [q];
                    } else if(ret == 2) {
                        res.push(q);
                    } else if(ret == 3)  { 
                    }
                } else {
                    res.push(q);
                }
            }
        }
        
        return res;
    }
    

    /**
     * 所有事件
     */  
    public EVENTS = [
        //  本科可以做的事情
        { name: '本科工作',from: '本科',to: '职员',properties: { health: 0,wealth: 1,ability: 1,happiness: 0 } },
        { name: '本科上课',from: '本科',to: '本科',properties: { health: 0,wealth: -1,ability: 2,happiness: 0 } },
        { name: '本科打酱油',from: '本科',to: '本科',properties: { health: -2,wealth: -10,ability: 10,happiness: 0 } },
        //  职员可以做的事情
        { name: '职员加薪',from: '职员',to: '职员',properties: { health: 1,wealth: 10,ability: 1,happiness: 0 } },
        { name: '职员升职',from: '职员',to: '职员',properties: { health: 1,wealth: 0,ability: 10,happiness: 0 } },
        { name: '职员喝酒',from: '职员',to: '职员',properties: { health: -10,wealth: 2,ability: 0,happiness: 0 } },
        { name: '职员辞职',from: '职员',to: '本科',properties: { health: -10,wealth: -10,ability: 10,happiness: 0 } }
    ];
    /**
     * 将Events转换成字典形式
     */ 
    public getEventsMap(events) {
        var map = {};
        for(var index in events) {
            var event = events[index];
            map[event.name] = event;
        }
        return map;
    }
    // 事件的字典表示形式
    public EVENTS_MAP = this.getEventsMap(this.EVENTS);
    
    /**
     * 所有结局
     */  
    public ENDINGS = [
        { condition: { health: 80,wealth: 100,ability: 90, happiness: 90 },result: { title: "人生赢家", desc: "" } },
        { condition: { health: 50,wealth: 50,ability: 50, happiness: 50 },result: { title: "平凡人生", desc: "" } },
        { condition: { health: -100,wealth: -100,ability: -100, happiness: -100 },result: { title: "悲惨人生", desc: "" } }
    ];
    
    /** 
     * 根据用户当前的属性，获取结局
     */ 
    public getMyEnding(properties) {
        var endings = this.ENDINGS;
        for(var index in endings) { 
            var ending = endings[index];
            var conds = ending.condition;
            var isPass = true;
            for(var k in conds) { 
                if(properties[k] < conds[k]) { 
                    isPass = false;
                    break;
                }
            }
            if(isPass) { 
                return ending;
            }
        }
    }
    

}