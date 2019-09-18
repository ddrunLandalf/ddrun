<template>
  <v-container
    fill-height
    fluid
    grid-list-xl
  >
    <v-layout wrap>
      <v-flex
        md12
        sm12
        lg4
      >
        <material-chart-card
          :data="dailySalesChart.data"
          :options="dailySalesChart.options"
          color="info"
          type="Line"
         >
          <h4 class="title font-weight-light">每日成交量</h4>
          <p class="category d-inline-flex font-weight-light">
            <v-icon
              :color="dailySalesChart.data.turnoverGrowth < 0 ? 'red':'green'"
              small
            >
              {{dailySalesChart.data.turnoverGrowth < 0 ? 'mdi-arrow-down':'mdi-arrow-up'}}
            </v-icon>
            <span :class="dailySalesChart.data.turnoverGrowth < 0 ? 'red--text':'green--text'">{{dailySalesChart.data.turnoverGrowth < 0 ? dailySalesChart.data.turnoverGrowth*(-1):dailySalesChart.data.turnoverGrowth}}%</span>&nbsp;
            近7天成交量
          </p>

          <template slot="actions">
            <v-icon
              class="mr-2"
              small
            >
              mdi-clock-outline
            </v-icon>
            <span class="caption grey--text font-weight-light">10分钟前的更新</span>
          </template>
        </material-chart-card>
      </v-flex>
      <v-flex
        md12
        sm12
        lg4
      >
        <material-chart-card
          :data="dailySalesChart2.data"
          :options="dailySalesChart2.options"
          color="red"
          type="Line"
         >
          <h4 class="title font-weight-light">每日成交额</h4>
          <p class="category d-inline-flex font-weight-light">
            <v-icon
              :color="dailySalesChart2.data.turnoverGrowth < 0 ? 'red':'green'"
              small
            >
              {{dailySalesChart2.data.turnoverGrowth < 0 ? 'mdi-arrow-down':'mdi-arrow-up'}}
            </v-icon>
            <span :class="dailySalesChart2.data.turnoverGrowth < 0 ? 'red--text':'green--text'">{{dailySalesChart2.data.turnoverGrowth < 0 ? dailySalesChart2.data.turnoverGrowth*(-1):dailySalesChart2.data.turnoverGrowth}}%</span>&nbsp;
            近7天成交额</p>

          <template slot="actions">
            <v-icon
              class="mr-2"
              small
            >
              mdi-clock-outline
            </v-icon>
            <span class="caption grey--text font-weight-light">10分钟前的更新</span>
          </template>
        </material-chart-card>
      </v-flex>
      <v-flex
        md12
        sm12
        lg4
      >
        <material-chart-card
          :data="dailySalesChart3.data"
          :options="dailySalesChart3.options"
          color="green"
          type="Line"
         >
          <h3 class="title font-weight-light">每日新增用户</h3>
          <p class="category d-inline-flex font-weight-light">
            <v-icon
              :color="dailySalesChart3.data.turnoverGrowth < 0 ? 'red':'green'"
              small
            >
              {{dailySalesChart3.data.turnoverGrowth < 0 ? 'mdi-arrow-down':'mdi-arrow-up'}}
            </v-icon>
            <span :class="dailySalesChart3.data.turnoverGrowth < 0 ? 'red--text':'green--text'">{{dailySalesChart3.data.turnoverGrowth < 0 ? dailySalesChart3.data.turnoverGrowth*(-1):dailySalesChart3.data.turnoverGrowth}}%</span>&nbsp;
            近7天新增用户数据</p>

          <template slot="actions">
            <v-icon
              class="mr-2"
              small
            >
              mdi-clock-outline
            </v-icon>
            <span class="caption grey--text font-weight-light">10分钟前的更新</span>
          </template>
        </material-chart-card>
      </v-flex>
      <v-flex
        sm6
        xs12
        md6
        lg3
      >
        <material-stats-card
          color="green"
          icon="mdi-store"
          title="成交额"
          :value="'￥'+dailySalesChart2.data.series[0][6]"
          sub-icon="mdi-calendar"
          sub-text="昨日数据"
        />
      </v-flex>
      <v-flex
        sm6
        xs12
        md6
        lg3
      >
        <material-stats-card
          color="orange"
          icon="mdi-content-copy"
          title="订单量"
          :value="dailySalesChart.data.series[0][6]+''"
          small-value="单"
          sub-icon="mdi-calendar"
          sub-text="昨日数据"
        />
      </v-flex>
      <v-flex
        sm6
        xs12
        md6
        lg3
      >
        <material-stats-card
          color="red"
          icon="mdi-account-card-details"
          title="会员购买量"
          :value="vipCount+''"
          small-value="单"
          sub-icon="mdi-calendar"
          sub-text="昨日数据"
        />
      </v-flex>
      <v-flex
        sm6
        xs12
        md6
        lg3
      >
        <material-stats-card
          color="info"
          icon="mdi-account-multiple-plus"
          title="用户增量"
          :value="'+'+dailySalesChart3.data.series[0][6]"
          sub-icon="mdi-calendar"
          sub-text="昨日数据"
        />
      </v-flex>
      <!-- <v-flex
        md12
        lg6
       >
        <material-card
          color="orange"
          title="跑男业绩排行"
          text="本周业绩排行"
        >
          <v-data-table
            :headers="headers"
            :items="items"
            hide-actions
          >
            <template
              slot="headerCell"
              slot-scope="{ header }"
            >
              <span
                class="font-weight-light text-warning text--darken-3"
                v-text="header.text"
              />
            </template>
            <template
              slot="items"
              slot-scope="{ index, item }"
            >
              <td>{{ index + 1 }}</td>
              <td>{{ item.name }}</td>
              <td class="text-xs-right">{{ item.salary }}</td>
              <td class="text-xs-right">{{ item.country }}</td>
              <td class="text-xs-right">{{ item.city }}</td>
            </template>
          </v-data-table>
        </material-card>
      </v-flex> -->
      <!-- <v-flex
        md12
        lg6
       >
        <material-card
          color="green"
          title="推广排行"
          text="本数据为实时数据"
        >
          <v-data-table
            :headers="headers2"
            :items="items2"
            hide-actions
          >
            <template
              slot="headerCell"
              slot-scope="{ header }"
            >
              <span
                class="font-weight-light text-success text--darken-3"
                v-text="header.text"
              />
            </template>
            <template
              slot="items"
              slot-scope="{ index, item }"
            >
              <td>{{ index + 1 }}</td>
              <td>{{ item.name }}</td>
              <td class="text-xs-right">{{ item.salary }}</td>
              <td class="text-xs-right">{{ item.country }}</td>
              <td class="text-xs-right">{{ item.city }}</td>
            </template>
          </v-data-table>
        </material-card>
      </v-flex> -->
    </v-layout>
  </v-container>
</template>

<script>
let _this;
export default {
  data () {
    return {
      vipCount:0,
      dailySalesChart: {
        data: {
          labels: ['12日', '13日', '14日', '15日', '16日', '17日', '19日'],
          series: [
            [0, 0, 0, 0, 0, 0, 0]
          ],
          turnoverGrowth:0
        },
        options: {
          lineSmooth: this.$chartist.Interpolation.cardinal({
            tension: 0
          }),
          low: 0,
          high: 100, 
          chartPadding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
          }
        }
      },
      dailySalesChart2: {
        data: {
          labels: ['12日', '13日', '14日', '15日', '16日', '17日', '19日'],
          series: [
            [0, 0, 0, 0, 0, 0, 0]
          ],
          turnoverGrowth:0
        },
        options: {
          lineSmooth: this.$chartist.Interpolation.cardinal({
            tension: 0
          }),
          low: 0,
          high: 100, 
          chartPadding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
          }
        }
      },
      dailySalesChart3: {
        data: {
          labels: ['12日', '13日', '14日', '15日', '16日', '17日', '19日'],
          series: [
            [0, 0, 0, 0, 0, 0, 0]
          ],
          turnoverGrowth:0
        },
        options: {
          lineSmooth: this.$chartist.Interpolation.cardinal({
            tension: 0
          }),
          low: 0,
          high: 100, 
          chartPadding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
          }
        }
      },
      headers: [
        {
          sortable: false,
          text: '#',
          value: 'id'
        },
        {
          sortable: false,
          text: '姓名',
          value: 'name'
        },
        {
          sortable: false,
          text: '成交额',
          value: 'salary',
          align: 'right'
        },
        {
          sortable: false,
          text: '成交量',
          value: 'country',
          align: 'right'
        },
        {
          sortable: false,
          text: '公司收益',
          value: 'city',
          align: 'right'
        }
      ],
      items: [
        {
          name: '迪丽热巴',
          country: '963',
          city: '￥3124',
          salary: '￥15620'
        },
        {
          name: '古力娜扎',
          country: '821',
          city: '￥2650.8',
          salary: '￥13254'
        }, {
          name: '马儿扎哈',
          country: '702',
          city: '￥2309.6',
          salary: '￥11548'
        }, {
          name: '萨顶顶',
          country: '632',
          city: '￥2304',
          salary: '￥11520'
        }, {
          name: '杨宗纬',
          country: '569',
          city: '￥1905.6',
          salary: '￥9528'
        }
      ],
      headers2: [
        {
          sortable: false,
          text: '#',
          value: 'id'
        },
        {
          sortable: false,
          text: '用户',
          value: 'name'
        },
        {
          sortable: false,
          text: '一级用户',
          value: 'salary',
          align: 'right'
        },
        {
          sortable: false,
          text: '二级用户',
          value: 'country',
          align: 'right'
        },
        {
          sortable: false,
          text: '收益',
          value: 'city',
          align: 'right'
        }
      ],
      tabs: 0,
      list: {
        0: false,
        1: false,
        2: false
      },
      items2: [
        {
          name: '178****9662',
          country: '6514',
          city: '￥2053',
          salary: '3851'
        },
        {
          name: '182****3607',
          country: '4565',
          city: '￥1502',
          salary: '3951'
        }, {
          name: '187****9605',
          country: '3652',
          city: '￥1350',
          salary: '2856'
        }, {
          name: '135****7527',
          country: '3208',
          city: '￥1026',
          salary: '2562'
        }, {
          name: '139****5654',
          country: '2630',
          city: '￥856',
          salary: '1956'
        }
      ]
    }
  },
  mounted(){
    _this = this;
    this.getAnlysis()
  },
  methods: {
    //获取分析数据
    getAnlysis () {
      this.$post('anlysis/overview',{},function(res){
        if(res.errno === 0){
          _this.dailySalesChart.data.labels = res.data.turnover;
          _this.dailySalesChart.data.series = [res.data.turnoverSerise];
          _this.dailySalesChart.options.high = res.data.turnoverMax;
          _this.dailySalesChart.data.turnoverGrowth = res.data.turnoverGrowth;

          _this.dailySalesChart2.data.labels = res.data.turnoverAmounts;
          _this.dailySalesChart2.data.series = [res.data.turnoverAmountsSerise];
          _this.dailySalesChart2.options.high = res.data.turnoverAmountsMax;
          _this.dailySalesChart2.data.turnoverGrowth = res.data.turnoverAmountsGrowth;

          _this.dailySalesChart3.data.labels = res.data.wxusers;
          _this.dailySalesChart3.data.series = [res.data.wxuserSerise];
          _this.dailySalesChart3.options.high = res.data.wxuserMax;
          _this.dailySalesChart3.data.turnoverGrowth = res.data.wxuserGrowth;

          _this.vipCount = res.data.vipCount;

        }
      })
    },
    complete (index) {
      this.list[index] = !this.list[index]
    }
  }
}
</script>
