import React, { useEffect, useState } from 'react'
import { observer, inject } from 'mobx-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  LabelList
} from 'recharts'

const RecentDives = inject('rootStore')(
  observer(({ rootStore }) => {
    const { diveStore } = rootStore
    const [chartData, setChartData] = useState([])

    const today = new Date()
    const formattedToday = today.toISOString().slice(0, 10)
    const fourteenDaysAgo = new Date(today - 14 * 24 * 60 * 60 * 1000)
    const formattedFourteenDaysAgo = fourteenDaysAgo.toISOString().slice(0, 10)

    useEffect(() => {
      const fetchData = async () => {
        try {
          await diveStore.fetchDivesByDate(
            formattedToday,
            formattedFourteenDaysAgo
          )
          const data = diveStore.dives
          const preparedData = prepareChartData(data.dives)
          setChartData(preparedData)
        } catch (error) {
          console.error(error)
        }
      }
      fetchData()
    }, [])

    const prepareChartData = diveData => {
      const siteData = {}

      diveData.forEach(dive => {
        const { diveSite, diveNumber, date, boat } = dive
        const key = `${diveSite}-${date}-${boat}`

        if (!siteData[diveSite]) {
          siteData[diveSite] = { dive1: 0, dive2: 0, dive3: 0 }
        }

        if (!siteData[diveSite][key]) {
          siteData[diveSite][key] = new Set()
        }

        siteData[diveSite][key].add(diveNumber)
      })

      Object.keys(siteData).forEach(site => {
        const keys = Object.keys(siteData[site]).filter(
          key => key !== 'dive1' && key !== 'dive2' && key !== 'dive3'
        )
        keys.forEach(key => {
          siteData[site][key].forEach(diveNumber => {
            siteData[site][`dive${diveNumber}`]++
          })
        })
      })

      return Object.keys(siteData).map(site => ({
        name: site,
        ...siteData[site]
      }))
    }

    const legendFormatter = name => {
      const legendMapping = {
        date: 'Date',
        diveSite: 'Dive Site',
        maxDepth: 'Max Depth',
        waterTemperature: 'Water Temperature',
        dive1: '9:00 AM',
        dive2: '11:00 AM',
        dive3: '1:00 PM',
        dive4: 'Night Dive'
      }
      return legendMapping[name] || name
    }
    return (
      <div style={{ width: '100%', height: '100%' }}>
        <h2>Where are we diving lately?</h2>
        <ResponsiveContainer width='100%' height={400} >
          <BarChart data={chartData} margin={{bottom: 75}}>
            <XAxis
              dataKey='name'
              tick={{
                angle: 45,
                textAnchor: 'start',
                dominantBaseline: 'ideographic',
                dy: 5 // Optional: To move the tick labels slightly down
              }}
            />
            <YAxis
              label={{
                value: 'Number of Dives',
                angle: -90,
                position: 'insideLeft'
              }}
              domain={[0, 'dataMax']}
              tickCount={10}
              allowDecimals={false}
            />
            <Tooltip />
            <Legend
              formatter={legendFormatter}
              layout='horizontal'
              align='center'
              verticalAlign='top'
            />
            <CartesianGrid stroke='#eee' strokeDasharray='5 5' />
            <Bar
              dataKey='dive1'
              stackId='a'
              fill='#8884d8'
              name={legendFormatter('dive1')}
            ></Bar>
            <Bar
              dataKey='dive2'
              stackId='a'
              fill='#82ca9d'
              name={legendFormatter('dive2')}
            ></Bar>
            <Bar
              dataKey='dive3'
              stackId='a'
              fill='#ffc658'
              name={legendFormatter('dive3')}
            >
              {/* <LabelList dataKey='name' position='top' angle={-90} /> */}
            </Bar>
            <Bar
              dataKey='dive4'
              stackId='a'
              fill='#ff6347'
              name={legendFormatter('dive4')}
            ></Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    )
  })
)

export default RecentDives
