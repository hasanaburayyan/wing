import {
  PutItemCommandInput,
  UpdateItemCommandInput,
  DynamoDBClient,
  PutItemCommand,
  UpdateItemCommand,
  PutItemCommandOutput,
  UpdateItemCommandOutput,
  DeleteItemCommandInput,
  DeleteItemCommandOutput,
  DeleteItemCommand,
  GetItemCommandInput,
  GetItemCommandOutput,
  GetItemCommand,
  ScanCommandInput,
  ScanCommandOutput,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";
import { mockClient } from "aws-sdk-client-mock";
import { test, expect, describe, beforeEach } from "vitest";

import { ColumnType } from "../../src/cloud";
import { TableClient } from "../../src/shared-aws/table.inflight";

const MOCK_TABLE_NAME = "MyBeautifulTable";
const PRIMARY_KEY = "id";
const dynamoMock = mockClient(DynamoDBClient);

describe("inflight table tests", () => {
  let client, row;
  beforeEach(() => {
    row = { id: "test", somenumber: 1 };
    const columns = {
      somenumber: ColumnType.NUMBER,
    };
    client = new TableClient(
      MOCK_TABLE_NAME,
      PRIMARY_KEY,
      JSON.stringify(columns)
    );
  });

  test("insert", async () => {
    // GIVEN
    const expectedRequest: PutItemCommandInput = {
      TableName: MOCK_TABLE_NAME,
      Item: {
        id: { S: row.id },
        somenumber: { N: String(row.somenumber) },
      },
    };
    const mockResponse: PutItemCommandOutput = {
      $metadata: {},
    };
    dynamoMock.on(PutItemCommand, expectedRequest).resolves(mockResponse);
    // WHEN
    const response = await client.insert(row as any);
    // THEN
    expect(response).toEqual(undefined);
  });

  test("update", async () => {
    // GIVEN
    const expectedRequest: UpdateItemCommandInput = {
      TableName: MOCK_TABLE_NAME,
      Key: { id: { S: row.id } },
      UpdateExpression: `SET somenumber = :somenumber`,
      ExpressionAttributeValues: {
        ":somenumber": { N: `${row.somenumber}` },
      },
    };
    const mockResponse: UpdateItemCommandOutput = {
      $metadata: {},
    };
    dynamoMock.on(UpdateItemCommand, expectedRequest).resolves(mockResponse);
    // WHEN
    const response = await client.update(row as any);
    // THEN
    expect(response).toEqual(undefined);
  });

  test("delete", async () => {
    // GIVEN
    const expectedRequest: DeleteItemCommandInput = {
      TableName: MOCK_TABLE_NAME,
      Key: { id: { S: row.id } },
    };
    const mockResponse: DeleteItemCommandOutput = {
      $metadata: {},
    };
    dynamoMock.on(DeleteItemCommand, expectedRequest).resolves(mockResponse);
    // WHEN
    const response = await client.delete(row.id);
    // THEN
    expect(response).toEqual(undefined);
  });

  test("get to a empty table", async () => {
    // GIVEN
    const expectedRequest: GetItemCommandInput = {
      TableName: MOCK_TABLE_NAME,
      Key: { id: { S: row.id } },
    };
    const mockResponse: GetItemCommandOutput = {
      $metadata: {},
    };
    dynamoMock.on(GetItemCommand, expectedRequest).resolves(mockResponse);
    // WHEN
    const response = await client.get(row.id);
    // THEN
    expect(response).toEqual({});
  });

  test("get", async () => {
    // GIVEN
    const expectedRequest: GetItemCommandInput = {
      TableName: MOCK_TABLE_NAME,
      Key: {
        id: { S: row.id },
      },
    };
    const mockResponse: GetItemCommandOutput = {
      $metadata: {},
      Item: {
        id: { S: `${row.id}` },
        somenumber: { N: `${row.somenumber}` },
      },
    };
    dynamoMock.on(GetItemCommand, expectedRequest).resolves(mockResponse);
    // WHEN
    const response = await client.get(row.id);
    // THEN
    expect(response).toEqual({ id: row.id, somenumber: row.somenumber });
  });

  test("list", async () => {
    // GIVEN
    const expectedRequest: ScanCommandInput = {
      TableName: MOCK_TABLE_NAME,
    };
    const mockResponse: ScanCommandOutput = {
      $metadata: {},
      Count: 0,
      Items: [
        { id: { S: "test1" }, somenumber: { N: "1" } },
        { id: { S: "test2" }, somenumber: { N: "2" } },
      ],
    };
    dynamoMock.on(ScanCommand, expectedRequest).resolves(mockResponse);
    // WHEN
    const response = await client.list();
    // THEN
    expect(response).toEqual([
      { id: "test1", somenumber: 1 },
      { id: "test2", somenumber: 2 },
    ]);
  });

  test("empty list", async () => {
    // GIVEN
    const expectedRequest: ScanCommandInput = {
      TableName: MOCK_TABLE_NAME,
    };
    const mockResponse: ScanCommandOutput = {
      $metadata: {},
      Count: 0,
      Items: [],
    };
    dynamoMock.on(ScanCommand, expectedRequest).resolves(mockResponse);
    // WHEN
    const response = await client.list();
    // THEN
    expect(response).toEqual([]);
  });
});
