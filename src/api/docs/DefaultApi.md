# DefaultApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createAdminDailyMetric**](#createadmindailymetric) | **POST** /admin/daily-metrics | Create daily metrics|
|[**getAdminDailyMetricById**](#getadmindailymetricbyid) | **GET** /admin/daily-metrics/{id} | Get daily metrics by ID|
|[**getAdminDailyMetrics**](#getadmindailymetrics) | **GET** /admin/daily-metrics | Get daily metrics|
|[**getDashboardRevenueTrend**](#getdashboardrevenuetrend) | **GET** /dashboard/revenue-trend | Get weekly revenue trend|
|[**getDashboardSummary**](#getdashboardsummary) | **GET** /dashboard/summary | Get dashboard summary for this week and last week|
|[**login**](#login) | **POST** /auth/login | User login|
|[**logout**](#logout) | **POST** /auth/logout | User logout|
|[**updateAdminDailyMetric**](#updateadmindailymetric) | **PUT** /admin/daily-metrics/{id} | Update daily metrics|

# **createAdminDailyMetric**
> DailyMetricItem createAdminDailyMetric(dailyMetricRequest)


### Example

```typescript
import {
    DefaultApi,
    Configuration,
    DailyMetricRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let dailyMetricRequest: DailyMetricRequest; //

const { status, data } = await apiInstance.createAdminDailyMetric(
    dailyMetricRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **dailyMetricRequest** | **DailyMetricRequest**|  | |


### Return type

**DailyMetricItem**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Daily metrics created successfully |  -  |
|**400** | Invalid request data |  -  |
|**401** | Missing or invalid authentication token |  -  |
|**403** | Admin role required |  -  |
|**409** | Metrics already exist for this date |  -  |
|**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getAdminDailyMetricById**
> DailyMetricItem getAdminDailyMetricById()


### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //Daily metrics record ID (default to undefined)

const { status, data } = await apiInstance.getAdminDailyMetricById(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | Daily metrics record ID | defaults to undefined|


### Return type

**DailyMetricItem**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Daily metrics retrieved successfully |  -  |
|**400** | Invalid ID |  -  |
|**401** | Missing or invalid authentication token |  -  |
|**403** | Admin role required |  -  |
|**404** | Daily metrics not found |  -  |
|**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getAdminDailyMetrics**
> DailyMetricList getAdminDailyMetrics()


### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let startDate: string; //Filter from this date through today if endDate is omitted (optional) (default to undefined)
let endDate: string; //Filter records up to this date (optional) (default to undefined)
let currentPage: number; // (optional) (default to 1)
let itemsPerPage: number; // (optional) (default to 10)

const { status, data } = await apiInstance.getAdminDailyMetrics(
    startDate,
    endDate,
    currentPage,
    itemsPerPage
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **startDate** | [**string**] | Filter from this date through today if endDate is omitted | (optional) defaults to undefined|
| **endDate** | [**string**] | Filter records up to this date | (optional) defaults to undefined|
| **currentPage** | [**number**] |  | (optional) defaults to 1|
| **itemsPerPage** | [**number**] |  | (optional) defaults to 10|


### Return type

**DailyMetricList**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Daily metrics retrieved successfully |  -  |
|**400** | Invalid query parameters |  -  |
|**401** | Missing or invalid authentication token |  -  |
|**403** | Admin role required |  -  |
|**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getDashboardRevenueTrend**
> RevenueTrendResponse getDashboardRevenueTrend()


### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let comparePrevious: boolean; //Include the previous week\'s data when true (optional) (default to false)

const { status, data } = await apiInstance.getDashboardRevenueTrend(
    comparePrevious
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **comparePrevious** | [**boolean**] | Include the previous week\&#39;s data when true | (optional) defaults to false|


### Return type

**RevenueTrendResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Revenue trend retrieved successfully |  -  |
|**401** | Missing or invalid authentication token |  -  |
|**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getDashboardSummary**
> DashboardSummary getDashboardSummary()


### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

const { status, data } = await apiInstance.getDashboardSummary();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**DashboardSummary**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Dashboard summary retrieved successfully |  -  |
|**401** | Missing or invalid authentication token |  -  |
|**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **login**
> LoginResponse login(loginRequest)

Authenticate an admin or staff user and set a JWT in an HttpOnly cookie.

### Example

```typescript
import {
    DefaultApi,
    Configuration,
    LoginRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let loginRequest: LoginRequest; //

const { status, data } = await apiInstance.login(
    loginRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **loginRequest** | **LoginRequest**|  | |


### Return type

**LoginResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Login successful. Sets the authentication cookie. |  * Set-Cookie - Clears the authentication cookie. <br>  |
|**400** | Invalid request |  -  |
|**401** | Invalid credentials |  -  |
|**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **logout**
> MessageResponse logout()

Log out the current user by clearing the JWT authentication cookie.

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

const { status, data } = await apiInstance.logout();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**MessageResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Logout successful. Clears the authentication cookie. |  * Set-Cookie - Clears the authentication cookie. <br>  |
|**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateAdminDailyMetric**
> DailyMetricItem updateAdminDailyMetric(dailyMetricRequest)


### Example

```typescript
import {
    DefaultApi,
    Configuration,
    DailyMetricRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //Daily metrics record ID (default to undefined)
let dailyMetricRequest: DailyMetricRequest; //

const { status, data } = await apiInstance.updateAdminDailyMetric(
    id,
    dailyMetricRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **dailyMetricRequest** | **DailyMetricRequest**|  | |
| **id** | [**string**] | Daily metrics record ID | defaults to undefined|


### Return type

**DailyMetricItem**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Daily metrics updated successfully |  -  |
|**400** | Invalid request data or ID |  -  |
|**401** | Missing or invalid authentication token |  -  |
|**403** | Admin role required |  -  |
|**404** | Daily metrics not found |  -  |
|**409** | Metrics already exist for this date |  -  |
|**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

