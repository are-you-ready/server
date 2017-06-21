# Are You Ready - Web Server

Web Server located at http://ayr.pf-n.co

# API

## Base URL

The base URL for all requests is

```
http://ayr.pf-n.co/api
```

## GET `/group/{groupName}`

Returns the document for the given `groupName`.

## POST `/group/{groupName}/events`

Create a new event for the specified group. Returns the updated group on success.

**JSON Params**

Field | Type | Description
------|------|------------
name | String | Name of the event
type | String | Type of the event (eat out, meet up, etc.)
description | String | A description of the event
location | String | Where the event is taking place
meetupLocation | String | Meetup location for the event (car, living room, etc.)
createdBy | String | (a real API wouldn't need this here, but use this to tell the server who you are)
notificationTime | Date | When to notify attendees to get ready (e.g. 5 minutes before `readyTime`)
readyTime | Date | Time of the event

## POST `group/{groupName}/event/{eventName}/status`

Update the status of an attendee for the specified event in the specified group. Returns the updated group on success.

Field | Type | Description
------|------|------------
userName | String | (a real API wouldn't need this here, but use this to tell the server who you are)
eventStatus | String | One of `not-coming`, `coming`, `not-ready`, `ready`

## JSON Error Response

The API may instead return an error as a little JSON object.

**JSON Error Response Example**

```json
{
  "errorCode": 10003,
  "errorDescription": "Group not found"
}
```

**JSON Error Codes**

Code | Meaning
-----|--------
10000 | Unknown error
10001 | Invalid group type
10002 | Group already exists
10003 | Group not found
